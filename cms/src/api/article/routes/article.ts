// cms/src/api/article/routes/article.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  config: {
    find: {
      auth: false,   // 列表公开
    },
    findOne: {
      auth: false,   // 单条公开（你这边用的是带 filters 的 find，其实也是走 find）
    },
  },
});