
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  app: {
    baseURL: '',
  },
  i18n: {
    locales: [
      {code: 'en', iso: 'en-US', file: 'translations/en.js'},
      {code: 'ms', iso: 'ms-MY', file: 'translations/ms.js'}
    ],
    defaultLocale: 'ms',
    detectBrowserLanguage: false,
    strategy: 'prefix_except_default'
  },
  nitro: {
    preset: 'github_pages'
  },
  runtimeConfig: {
    public: {
      isDev: process.env.NODE_ENV === 'development',
    },
  },
  colorMode: {
    preference: 'light',
  },
});