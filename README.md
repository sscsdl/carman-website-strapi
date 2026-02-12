# Website3 – 官网 + Blog（Strapi + Nuxt）

- **cms/**：Strapi 5 自托管后台，多语言 (en, zh-Hans, zh-Hant)，Article 内容类型，i18n 已开启。
- **web/**：Nuxt 3 前台，复制自 old_system 的静态资源，首页 + 博客列表/详情，请求 Strapi API，无翻译时回退到 en。
- **old_system/**：旧版 Nuxt 半成品（不修改，仅作参考）。

## 本地开发

### 1. 后台 CMS（Strapi）

**本地开发**（带热更新，无需先 build）：

```bash
cd cms
npm install
npm run dev
```

**生产运行**（需先构建）：先执行 `npm run build`，再执行 `npm run start`。未 build 就执行 `start` 会报 “Make sure you are in the right directory”。

- 首次运行会提示创建管理员账号。
- 后台：http://localhost:1337/admin  
- **Settings → Global Settings → Internationalization**：添加 locales `zh-Hans`、`zh-Hant`（en 默认已有）。
- **Settings → Users & Permissions → Public**：为 `Article` 勾选 `find`、`findOne`，以便前台无需登录即可读文章。

### 2. 前台 Web（Nuxt）

```bash
cd web
npm install
# 确保 cms 已运行在 1337，或设置 NUXT_PUBLIC_STRAPI_URL
npm run dev
```

- 前台：http://localhost:3000  
- 多语言路由示例：`/en/blog`、`/zh-Hans/blog`、`/zh-Hant/blog`；无翻译时自动回退到 en。

## 环境变量

- **web**：`NUXT_PUBLIC_STRAPI_URL`：Strapi 地址，默认 `http://localhost:1337`。
- **cms**：见 `cms/.env.example`（数据库、JWT 等）。

## 部署说明

### 方案一：将 Nuxt 静态文件部署到 Strapi public 目录（推荐）

这种方式将前端静态文件放在 Strapi 的 `public/` 目录下，通过 Strapi 服务器统一提供前端和 API 服务。

**步骤：**

1. **构建并部署前端到 Strapi public 目录：**
   ```bash
   cd web
   npm install
   # 设置生产环境的 Strapi URL（如果需要）
   export NUXT_PUBLIC_STRAPI_URL=https://your-domain.com
   # 生成静态文件并部署到 cms/public
   npm run deploy
   ```

2. **构建并启动 Strapi：**
   ```bash
   cd cms
   npm install
   npm run build
   npm run start
   ```

3. **访问：**
   - 前端网站：`http://your-domain.com/`（或 `https://your-domain.com/`）
   - 后台管理：`http://your-domain.com/admin`
   - API：`http://your-domain.com/api/...`

**注意：**
- 部署脚本会自动备份和恢复 `uploads/` 目录和 `robots.txt`
- 确保 `NUXT_PUBLIC_STRAPI_URL` 指向正确的 Strapi 地址（生产环境应该是相对路径或完整 URL）

### 方案二：独立部署（传统方式）

- **Strapi**：自托管时使用 Node 运行 `npm run build && npm run start`，数据库可换为 PostgreSQL 等（见 Strapi 文档）。
- **Nuxt**：构建后 `npm run generate` 或 `npm run build` + Node 运行，将 `NUXT_PUBLIC_STRAPI_URL` 指向线上 Strapi 地址。
- 后台可公网访问时，建议强密码 + 必要时配合 Nginx 限流/IP 白名单。
