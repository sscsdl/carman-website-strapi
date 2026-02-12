"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// cms/src/api/article/routes/article.ts
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreRouter('api::article.article', {
    config: {
        find: {
            auth: false, // 列表公开
        },
        findOne: {
            auth: false, // 单条公开（你这边用的是带 filters 的 find，其实也是走 find）
        },
    },
});
