export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  env: {
    appName: process.env.MIX_APP_NAME,
    appURL: process.env.MIX_APP_URL,
    key: process.env.MIX_RECAPTCHA_SITE_KEY,
    appEnv: process.env.NODE_ENV
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.MIX_APP_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/scss/app.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/helper.ts',
    '~plugins/formulate',
    '~plugins/showdown.ts',
    '~plugins/simplemde.ts',
    '~plugins/recaptcha.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.MIX_APP_URL,
    proxy: true
  },

  proxy: {
    '/laravel': {
      target: process.env.MIX_APP_URL,
      pathRewrite: { '^/laravel': '/' }
    }
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      home: false
    },
    strategies: {
      local: {
        provider: 'laravel/jwt',
        url: process.env.MIX_APP_URL
      }
    }
  },

  router: {
    middleware: ['auth']
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
