"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        // 如果请求的是 API 路径或 admin 路径，直接跳过
        if (ctx.url.startsWith('/api/') ||
            ctx.url.startsWith('/admin') ||
            ctx.url.startsWith('/_nuxt') ||
            ctx.url.startsWith('/uploads') ||
            ctx.url.startsWith('/.strapi')) {
            return await next();
        }
        // 如果 URL 包含文件扩展名（如 .js, .css, .png 等），直接跳过
        if (ctx.url.includes('.') && !ctx.url.endsWith('/')) {
            return await next();
        }
        // 先执行其他中间件（包括 strapi::public）
        await next();
        // 如果响应状态码是 404，或者根路径没有被正确处理，返回 index.html
        if (ctx.status === 404 || (ctx.url === '/' && ctx.status !== 200)) {
            try {
                const publicDir = strapi.dirs.static.public;
                const indexPath = (0, path_1.join)(publicDir, 'index.html');
                if ((0, fs_1.existsSync)(indexPath)) {
                    const indexContent = (0, fs_1.readFileSync)(indexPath, 'utf-8');
                    ctx.body = indexContent;
                    ctx.type = 'text/html';
                    ctx.status = 200;
                }
            }
            catch (error) {
                // 如果 index.html 不存在或读取失败，保持原状态
                console.error('SPA Fallback: Failed to read index.html', error);
            }
        }
    };
};
