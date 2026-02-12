/**
 * CSP Override 中间件
 * 在 strapi::security 之后执行，覆盖默认的 CSP 策略
 * 允许 Nuxt 应用的内联脚本执行（仅对前端页面）
 */
import type { Core } from '@strapi/strapi';

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    // 先执行下一个中间件（包括 strapi::security）
    await next();

    // 修改响应头，设置更宽松的 CSP 策略（仅对前端页面）
    // 如果是 API 或 admin 路径，保持默认策略
    if (
      !ctx.url.startsWith('/api/') &&
      !ctx.url.startsWith('/admin') &&
      !ctx.url.startsWith('/.strapi') &&
      ctx.type === 'text/html'
    ) {
      // 覆盖 CSP 头，允许内联脚本和样式
      ctx.set('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
        "style-src 'self' 'unsafe-inline' https:",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data: https:",
        "connect-src 'self' https:",
        "frame-src 'self'",
      ].join('; '));
    }
  };
};

