export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', files: ['en.json'] },
      { code: 'de', iso: 'de-DE', name: 'Deutsch', files: ['de.json']}
    ],
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    lazy: false,
    vueI18n: './vue-i18n.js'
  }
})
