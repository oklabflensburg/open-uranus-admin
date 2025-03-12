export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
