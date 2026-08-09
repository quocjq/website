// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-csurf'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    experimental: {
      componentDetection: true
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },

  compatibilityDate: '2026-06-30',

  vite: {
    ssr: {
      noExternal: ['vim-prosemirror']
    },
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        'yjs'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
