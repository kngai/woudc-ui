import colors from 'vuetify/es5/util/colors'
import pkg from './package.json'

export default {
  telemetry: false, // disable prompt to collect annoynmous data from nuxt
  router: {
    base: process.env.WOUDC_UI_ROUTER_BASE || '/',
  },
  /*
   ** Global headers of the page
   */
  head: {
    titleTemplate: `%s - WOUDC`, // default title template
    title: pkg.name || 'WOUDC',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          pkg.description ||
          'A World Meteorological Organization (WMO) data centre supporting the Global Atmosphere Watch (GAW) program operated by Environment and Climate Change Canada.',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: process.env.WOUDC_UI_ROUTER_BASE + '/wmo-favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: process.env.WOUDC_UI_ROUTER_BASE + '/wmo-favicon-16x16.png',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@mdi/font/css/materialdesignicons.min.css'],
  /*
   ** Plugins to load to $root instance before mounting the App
   */
  plugins: ['~/plugins/woudcMeta.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/google-fonts',
    ['@nuxtjs/dotenv', { filename: '.env' }],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/i18n',
    'nuxt-leaflet',
    '@nuxtjs/sitemap',
  ],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    defaultAssets: false, // defaults to local mdi icons and font
    theme: {
      themes: {
        light: {
          primary: '#085eab',
          secondary: '#1bb4d4',
          // success: '#83EF9E',
          // info: '#B3E5FC',
          // warning: '#FFF59D',
          // error: '#EF9A9A',
          accent: '#faa52e',
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** @nuxtjs/sitemap module options
   */
  sitemap: {
    hostname: 'https://woudc.org',
    i18n: true,
  },
  /*
   ** nuxt-i18n module global options
   */
  i18n: {
    locales: [
      {
        code: 'fr',
        iso: 'fr-CA',
        name: 'Français',
      },
      {
        code: 'en',
        iso: 'en-CA',
        name: 'English',
      },
    ],
    strategy: 'prefix',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: ['en', 'fr'],
      messages: {
        en: require('./locales/en.json'),
        fr: require('./locales/fr.json'),
      },
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'woudc_default_language',
    },
    baseUrl: process.env.WOUDC_UI_BASE_URL + process.env.WOUDC_UI_ROUTER_BASE,
  },
  /*
   ** Build configuration
   */
  ssr: true, // false for SPA mode, true for full static mode
  target: 'static', // static hosting
  googleFonts: {
    // Vuetify default font:
    // https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap
    families: {
      Roboto: [100, 300, 400, 500, 700, 900],
    },
    display: 'swap',
    download: true,
    overwriting: true,
  },
  build: {
    filenames: {
      // app: '[name].js'
    },
    extend(config, { isClient }) {
      if (isClient) {
        config.performance = {
          maxAssetSize: 1843.2 * 1024, // Increase asset size limit (e.g., 1.8 MB)
          maxEntrypointSize: 1843.2 * 1024, // Increase entrypoint size limit (e.g., 1.8 MB)
        }
      }
    },
  },
  generate: {
    fallback: '200.html',
    exclude: [
      // dynamically generated pages to use SPA fallback
      /\/data\/stations\/[\d]+$/,
      /\/donnees\/stations\/[\d]+$/,
      /\/contributors\/[\d\w-_]{1,8}$/,
      /\/contributeurs\/[\d\w-_]{1,8}$/,
      /\/data\/dataset-information/,
      /\/donnees\/information-sur-les-jeux-de-donnees/,
    ],
  },
  publicRuntimeConfig: {
    WOUDC_UI_BASE_URL: process.env.WOUDC_UI_BASE_URL,
    WOUDC_UI_API_URL: process.env.WOUDC_UI_API_URL,
    WOUDC_UI_API_MAX_LIMIT: process.env.WOUDC_UI_API_MAX_LIMIT || 10000,
    WOUDC_UI_EMAIL_ADDRESS: process.env.WOUDC_UI_EMAIL_ADDRESS,
    WOUDC_UI_WAF_URL: process.env.WOUDC_UI_WAF_URL,
    WOUDC_UI_WMO_REGIONS_URL: process.env.WOUDC_UI_WMO_REGIONS_URL,
    appBuildYYYY: new Date().getFullYear(),
    appVersion: pkg.version,
    appName: pkg.name,
    appHomepage: pkg.homepage,
  },
}
