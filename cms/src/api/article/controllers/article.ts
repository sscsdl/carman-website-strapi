import { factories } from '@strapi/strapi';

// 使用核心控制器，提供默认的 find / findOne / create / update / delete 等动作
export default factories.createCoreController('api::article.article');

