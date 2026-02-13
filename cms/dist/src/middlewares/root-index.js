"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (_config, { strapi }) => {
    return async (ctx, next) => {
        var _a, _b, _c;
        const path = (_c = (_a = ctx.path) !== null && _a !== void 0 ? _a : (_b = ctx.url) === null || _b === void 0 ? void 0 : _b.split('?')[0]) !== null && _c !== void 0 ? _c : '';
        if (path !== '/') {
            return await next();
        }
        try {
            const publicDir = strapi.dirs.static.public;
            const indexPath = (0, path_1.join)(publicDir, 'index.html');
            if ((0, fs_1.existsSync)(indexPath)) {
                ctx.body = (0, fs_1.readFileSync)(indexPath, 'utf-8');
                ctx.type = 'text/html';
                ctx.status = 200;
                return;
            }
        }
        catch (_err) {
            // 无 index.html 时交给后续中间件（可能被重定向到 /admin）
        }
        return await next();
    };
};
