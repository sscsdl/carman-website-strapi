// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_and_default',
    locales: [
      { name: 'English', code: 'en', iso: 'en-US', dir: 'ltr' },
      { name: '简体中文', code: 'zh-Hans', iso: 'zh-CN', dir: 'ltr' },
      { name: '繁體中文', code: 'zh-Hant', iso: 'zh-TW', dir: 'ltr' },
    ],
    defaultLocale: 'en',
    vueI18n: '~/i18n.config.ts',
    // 禁用优化翻译指令的警告
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  runtimeConfig: {
    public: {
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 
        (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1337'),
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  // 静态生成配置：使用 generate 命令时输出到 Strapi 的 public 目录
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
});
