import {getCurrentUser} from 'vuefire'

export default defineNuxtRouteMiddleware(async (to) => {
    // Do not check login pages to avoid infinite loop
    if (to.path === '/login') return
    if (to.path === '/fr/login') return

    // Avoid checking on server side
    if (process.server) return

    const user = await getCurrentUser()
    if (!user) {
        const localePath = useLocalePath()
        return navigateTo({path: localePath('/login')})
    }
})