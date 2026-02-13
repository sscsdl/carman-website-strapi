import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'global::root-index', // 根路径 / 优先走 cms/public 下的 Nuxt index.html
  'strapi::security', // 必需的核心中间件
  'global::csp-override', // 自定义中间件：覆盖 CSP 策略（允许内联脚本）
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // SPA fallback 中间件：处理前端路由
  'global::spa-fallback',
];

export default config;
