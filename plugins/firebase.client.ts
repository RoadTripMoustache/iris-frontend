import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public

    // Empêche la double initialisation
    const app = getApps().length ? getApps()[0] : initializeApp(config)

    const auth = getAuth(app)

    // Injection dans l'app Nuxt
    return {
        provide: {
            firebaseApp: app,
            firebaseAuth: auth,
        }
    }
})
