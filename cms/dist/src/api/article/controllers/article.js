"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// 使用核心控制器，提供默认的 find / findOne / create / update / delete 等动作
exports.default = strapi_1.factories.createCoreController('api::article.article');
