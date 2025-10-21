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
            sessionCookie: false
        },
        config: {
            apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAKeCD6jY44ulKEXYMQ4Cuqcege61sgcvc',
            authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'testrtm-3d47d.firebaseapp.com',
            projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'testrtm-3d47d',
            storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'testrtm-3d47d.firebasestorage.app',
            messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '588302947874',
            appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:588302947874:web:f22a18b13c28ce3a2d5c7b',
        }
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
            apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAKeCD6jY44ulKEXYMQ4Cuqcege61sgcvc',
            authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'testrtm-3d47d.firebaseapp.com',
            projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'testrtm-3d47d',
            storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'testrtm-3d47d.firebasestorage.app',
            messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '588302947874',
            appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:588302947874:web:f22a18b13c28ce3a2d5c7b',
        }
    },
})