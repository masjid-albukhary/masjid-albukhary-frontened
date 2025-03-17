// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui',],
  app: {
    baseURL: process.env.NODE_ENV === 'development' ? '' : '/masjid-albukhary-frontened/',
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