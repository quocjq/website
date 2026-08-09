// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'lunatix · dashboard',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'lunatix server dashboard' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    },
  },
})
