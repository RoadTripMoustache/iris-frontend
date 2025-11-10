export default defineNuxtPlugin(async (nuxtApp) => {
  if (!process.client) return
  try {
    const res = await fetch('/api/data/config.json')
    if (!res.ok) throw new Error('Impossible de charger /api/data/config.json')
    const data = await res.json()
    // Expecting keys: apiBaseUrl, appTitle, appLoginTitle, appIcon
    const state = useState<any>('app:publicRuntime', () => ({}))
    Object.assign(state.value, data)
  } catch (e) {
    console.error('Erreur lors du chargement des configurations publiques:', e)
  }
})
