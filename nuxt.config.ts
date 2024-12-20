// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons',
    'nuxt-security',
    '@nuxtjs/turnstile',
    '@nuxt/scripts',
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      flickViewApiUrl: 'https://api.flickview.com',
      apiKey: '',
    },
    turnstile: {
      secretKey: '',
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
  turnstile: {
    siteKey: '',
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'https://*.flickr.com', 'https://*.staticflickr.com'],
      }
    }
  }
})