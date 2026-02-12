"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// 使用默认的核心 Service，提供 find / findOne / create / update / delete 等基础能力
exports.default = strapi_1.factories.createCoreService('api::article.article');
