"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::article.article', ({ strapi }) => ({
    async find(ctx) {
        var _a, _b, _c, _d, _e, _f, _g;
        const categorySlug = (_a = ctx.query) === null || _a === void 0 ? void 0 : _a.categorySlug;
        if (!categorySlug) {
            return super.find(ctx);
        }
        const locale = ((_b = ctx.query) === null || _b === void 0 ? void 0 : _b.locale) || 'en';
        const page = Math.max(1, Number((_d = (_c = ctx.query) === null || _c === void 0 ? void 0 : _c.pagination) === null || _d === void 0 ? void 0 : _d['page']) || 1);
        const pageSize = Math.min(25, Math.max(1, Number((_f = (_e = ctx.query) === null || _e === void 0 ? void 0 : _e.pagination) === null || _f === void 0 ? void 0 : _f['pageSize']) || 25));
        const categoryDocs = await strapi.documents('api::category.category').findMany({
            locale,
            filters: { slug: { $eq: categorySlug } },
        });
        const categoryDocId = (_g = categoryDocs[0]) === null || _g === void 0 ? void 0 : _g.documentId;
        if (!categoryDocId) {
            ctx.body = { data: [], meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } } };
            return;
        }
        const [documents, total] = await Promise.all([
            strapi.documents('api::article.article').findMany({
                locale,
                publicationState: 'live',
                filters: { category: { documentId: { $eq: categoryDocId } } },
                sort: { publishedAt: 'desc' },
                populate: { poster: true, category: true },
                pagination: { page, pageSize },
            }),
            strapi.documents('api::article.article').count({
                locale,
                publicationState: 'live',
                filters: { category: { documentId: { $eq: categoryDocId } } },
            }),
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
