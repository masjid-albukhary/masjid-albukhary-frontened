export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', '@nuxtjs/i18n'],
    i18n: {
        locales: [
            {code: 'en', iso: 'en-US', file: 'translations/en.js'},
            {code: 'ms', iso: 'ms-MY', file: 'translations/ms.js'}
        ],
        defaultLocale: 'en',
        detectBrowserLanguage: false,
        strategy: 'prefix_except_default'
    },
    nitro: {
        preset: 'github_pages'
    },
    app: {
        baseURL: '',
    }, runtimeConfig: {
        public: {
            isDev: process.env.NODE_ENV === 'development',
            apiBase: process.env.API_BASE_URL ||
                (process.env.NODE_ENV === 'development'
                    ? 'http://localhost:8000/api'
                    : 'https://masjid-albukhary-backend-production.up.railway.app/api')
        },
    },
    colorMode: {
        preference: 'light',
    },
});