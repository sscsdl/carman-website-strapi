import { factories } from '@strapi/strapi';

// 使用默认的核心 Service，提供 find / findOne / create / update / delete 等基础能力
export default factories.createCoreService('api::article.article');

