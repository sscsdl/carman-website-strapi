import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    const categorySlug = ctx.query?.categorySlug as string | undefined;
    if (!categorySlug) {
      return super.find(ctx);
    }

    const locale = (ctx.query?.locale as string) || 'en';
    const page = Math.max(1, Number(ctx.query?.pagination?.['page']) || 1);
    const pageSize = Math.min(25, Math.max(1, Number(ctx.query?.pagination?.['pageSize']) || 25));
    const start = (page - 1) * pageSize;

    const categoryDocs = await strapi.documents('api::category.category').findMany({
      locale,
      filters: { slug: { $eq: categorySlug } },
    });
    const categoryDocId = categoryDocs[0]?.documentId;
    if (!categoryDocId) {
      ctx.body = { data: [], meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } } };
      return;
    }

    const baseParams = {
      locale,
      status: 'published' as const,
      filters: { category: { documentId: { $eq: categoryDocId } } },
    };

    const [documents, total] = await Promise.all([
      strapi.documents('api::article.article').findMany({
        ...baseParams,
        sort: 'publishedAt:desc',
        populate: { poster: true, category: true },
        limit: pageSize,
        start,
      }),
      strapi.documents('api::article.article').count(baseParams),
    ]);

    const pageCount = Math.ceil(total / pageSize);
    ctx.body = {
      data: documents,
      meta: {
        pagination: { page, pageSize, pageCount, total },
      },
    };
  },
}));

