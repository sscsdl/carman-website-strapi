"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * SPA Fallback 中间件
 * 将前端路由请求重定向到 index.html，以支持 Nuxt 静态生成的前端应用
 */
exports.default = () => {
    return async (ctx, next) => {
        await next();
        // 如果请求的是 API 路径或 admin 路径，不处理
        if (ctx.url.startsWith('/api/') ||
            ctx.url.startsWith('/admin') ||
            ctx.url.startsWith('/_nuxt') ||
            ctx.url.startsWith('/uploads') ||
            ctx.url.includes('.')) {
            return;
        }
        // 如果响应状态码是 404，且不是 API 请求，返回 index.html（SPA fallback）
        if (ctx.status === 404 && !ctx.url.startsWith('/api/')) {
            ctx.url = '/index.html';
            ctx.status = 200;
        }
    };
};
