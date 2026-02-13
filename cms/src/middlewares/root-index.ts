/**
 * 根路径中间件：将 / 请求交给 cms/public 下的 index.html（Nuxt 构建产物）
 * 必须在 strapi::public 之前执行，避免 Strapi 默认把 / 重定向到 /admin
 */
import type { Core } from '@strapi/strapi';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: { url: string; path?: string; body?: string; type?: string; status?: number }, next: () => Promise<void>) => {
    const path = ctx.path ?? ctx.url?.split('?')[0] ?? '';
    if (path !== '/') {
      return await next();
    }

    try {
      const publicDir = strapi.dirs.static.public;
      const indexPath = join(publicDir, 'index.html');
      if (existsSync(indexPath)) {
        ctx.body = readFileSync(indexPath, 'utf-8');
        ctx.type = 'text/html';
        ctx.status = 200;
        return;
      }
    } catch (_err) {
      // 无 index.html 时交给后续中间件（可能被重定向到 /admin）
    }
    return await next();
  };
};
