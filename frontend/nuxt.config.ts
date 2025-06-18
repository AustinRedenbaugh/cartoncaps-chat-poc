export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],

  build: {
    postcss: {
      plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {}
      }
    }
  },

  modules: ['shadcn-nuxt', '@nuxtjs/tailwindcss', '@nuxt/icon'],

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.PYTHON_API_BASE_URL
    }
  },

  compatibilityDate: '2025-03-22'
})