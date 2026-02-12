# Strapi CMS – Blog 后台

- 已启用 **i18n**（`config/plugins.ts`），内容类型 **Article** 支持多语言。
- 支持语言：**en**（默认）、**zh-Hans**、**zh-Hant**（需在后台 Settings → Internationalization 中添加 zh-Hans、zh-Hant）。

## Article 字段

| 字段     | 类型     | 说明           |
|----------|----------|----------------|
| path     | string   | 唯一 URL 路径，非本地化 |
| title    | string   | 标题，本地化   |
| summary  | text     | 摘要，本地化   |
| content  | richtext | 正文，本地化   |
| poster   | media    | 封面图，非本地化 |

## 首次启动后

1. 创建管理员账号。
2. **Settings → Global Settings → Internationalization** → Add new locale → 添加 **zh-Hans**、**zh-Hant**。
3. **Settings → Users & Permissions → Roles → Public** → 勾选 Article 的 **find**、**findOne**，保存。
