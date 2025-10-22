// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    devServer: {
        port: 3002,
        host: '0.0.0.0' // do not put localhost (only accessible from the host machine)
    },
    css: ['~/assets/styles.css'],
    modules: [
        'nuxt-vuefire'
    ],
    vuefire: {
        auth: {
            enabled: true,
            sessionCookie: false,
        },
        config: {
            apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        },
        optionsApiPlugin: false,
        appCheck: {
            provider: false,
            isTokenAutoRefreshEnabled: false,
        }
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
        }
    },
    // Désactiver SSR complètement si les problèmes persistent
    ssr: false,
})