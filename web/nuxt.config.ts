// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_and_default',
    locales: [
      { name: 'English', code: 'en', iso: 'en-US', dir: 'ltr', file: 'en.json' },
      { name: '简体中文', code: 'zh-Hans', iso: 'zh-CN', dir: 'ltr', file: 'zh-Hans.json' },
      { name: '繁體中文', code: 'zh-Hant', iso: 'zh-TW', dir: 'ltr', file: 'zh-Hant.json' },
    ],
    defaultLocale: 'en',
    // 语言文件目录，相对于项目根目录
    langDir: 'i18n/',
    lazy: true,
  },
  runtimeConfig: {
    public: {
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
});
