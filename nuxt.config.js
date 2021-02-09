const env = {
  app: process.env.NODE_ENV || 'production',
  name: process.env.MIX_APP_NAME || 'SMK BPI',
  api: process.env.MIX_APP_URL || 'http://localhost:8069',
  fe: process.env.MIX_APP_URL_FE || 'http://localhost:3000',
  recapKey: process.env.MIX_RECAPTCHA_SITE_KEY,
}

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  env: {
    appName: env.name,
    appURL: env.api,
    key: env.recapKey,
    appEnv: env.app
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: env.name,
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
    '~plugins/showdown.ts',
    '~plugins/simplemde.ts',
    '~plugins/formulate',
    '~plugins/recaptcha.ts',
    '~plugins/icon.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  ignore: ['~components/InputMark.vue'],

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
    baseURL: env.api,
    proxy: true
  },

  proxy: {
    '/laravel': {
      target: env.api,
      pathRewrite: { '^/laravel': '/' }
    }
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: env.api
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: env.api
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
        url: env.api
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
      name: env.name,
      short_name: env.name,
      description: 'Bermartabat, Berkualitas, dan Tepercaya',
      background_color: '#f8fafc'
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
