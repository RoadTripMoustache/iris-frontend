import { defineNuxtPlugin } from '#app'
import { initializeApp } from 'firebase/app'
import { VueFire, VueFireAuth } from 'vuefire'

export default defineNuxtPlugin(async (nuxtApp) => {
    const res = await fetch('/api/data/firebase-config.json')
    if (!res.ok) throw new Error('Impossible de charger le fichier de config Firebase')

    const env = await res.json()

    const firebaseApp = initializeApp({
        apiKey: env.apiKey,
        authDomain: env.authDomain,
        projectId: env.projectId,
        storageBucket: env.storageBucket,
        messagingSenderId: env.messagingSenderId,
        appId: env.appId
    })

    nuxtApp.vueApp.use(VueFire, {
        firebaseApp,
        modules: [VueFireAuth()]
    })
})
