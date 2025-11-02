import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to) => {
  // Ne pas appliquer sur la page de login pour éviter une boucle de redirection
  if (to.path === '/login') return

  // Éviter l'accès Firebase côté serveur (SSR)
  if (process.server) return

  const user = await getCurrentUser()
  if (!user) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})