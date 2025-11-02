// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    devServer: {
        port: 3002,
        host: '0.0.0.0'
    },
    plugins: [
        '~/plugins/vuefire.client.ts',
        '~/plugins/runtime-config.client.ts',
        '~/plugins/configs.client.ts',
        '~/plugins/head.client.ts',
    ],

    css: ['~/assets/styles.css'],

    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/google-fonts'
    ],

    // ⚙️ Configuration Nuxt Runtime
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
            appTitle: process.env.NUXT_PUBLIC_TITLE || 'Iris',
            appLoginTitle: process.env.NUXT_PUBLIC_LOGIN_TITLE,
            appIcon: process.env.NUXT_PUBLIC_ICON || '/logo.png',
        }
    },

    googleFonts: {
        families: {
            'Material Icons': true
        }
    },

    ssr: false,

    i18n: {
        locales: [
            { code: 'fr', name: 'Français', file: 'fr.json' },
            { code: 'en', name: 'English', file: 'en.json' }
        ],
        defaultLocale: 'en'
    }
})
