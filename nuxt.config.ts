// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    devServer: {
        port: 3002,
        host: '0.0.0.0' // do not put localhost (only accessible from the host machine)
    }
})
