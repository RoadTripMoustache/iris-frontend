import { ref, computed, watch } from 'vue'
import type { Configs } from '~/lib/models'
import { ConfigsApi } from '~/lib/api'
import { useAuth } from '~/composables/useAuth'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const LS_KEY = 'app.configs.cache'

interface CachedConfigs {
  data: Configs
  fetchedAt: number
}

export function useConfigs() {
  // Shared reactive state across app
  const configs = useState<Configs | null>('configs:data', () => null)
  const fetchedAt = useState<number | null>('configs:fetchedAt', () => null)
  const loading = useState<boolean>('configs:loading', () => false)
  const error = useState<string | null>('configs:error', () => null)

  const isStale = computed(() => {
    if (!fetchedAt.value) return true
    return Date.now() - fetchedAt.value >= ONE_DAY_MS
  })

  function restoreFromLocalStorage() {
    if (!process.client) return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CachedConfigs
      if (parsed?.data && typeof parsed.fetchedAt === 'number') {
        configs.value = parsed.data
        fetchedAt.value = parsed.fetchedAt
      }
    } catch (_) {
      // ignore parse errors
    }
  }

  function persistToLocalStorage() {
    if (!process.client) return
    try {
      if (configs.value && fetchedAt.value) {
        const payload: CachedConfigs = { data: configs.value, fetchedAt: fetchedAt.value }
        localStorage.setItem(LS_KEY, JSON.stringify(payload))
      }
    } catch (_) {
      // storage can fail (quota, private mode), ignore
    }
  }

  async function fetchConfigs(force = false) {
    if (!process.client) return
    if (loading.value) return
    if (!force && !isStale.value && configs.value) return
    loading.value = true
    error.value = null
    try {
      // Attempt to call API. If user not authenticated, api layer will throw.
      const data = await ConfigsApi.get()
      configs.value = data
      fetchedAt.value = Date.now()
      persistToLocalStorage()
    } catch (e: any) {
      // Swallow errors, but keep last good cached value
      error.value = e?.message || 'Failed to load configs'
    } finally {
      loading.value = false
    }
  }

  // Initialize: restore cache, then fetch if needed and possible
  function initConfigsRefresh() {
    if (!process.client) return
    restoreFromLocalStorage()

    // If unauthenticated at startup, wait for login before first fetch
    const { user } = useAuth()

    // If already have a user, try fetch immediately if stale/missing
    if (user.value && (isStale.value || !configs.value)) {
      void fetchConfigs(true)
    }

    // When user becomes available (login), ensure we fetch at least once if stale/missing
    watch(user, (u) => {
      if (u && (isStale.value || !configs.value)) {
        void fetchConfigs(true)
      }
    }, { once: true })

    // Schedule background refresh every 24h
    // We avoid multiple intervals by storing handler on window
    const w = window as any
    if (!w.__configsRefreshInterval) {
      w.__configsRefreshInterval = setInterval(() => {
        void fetchConfigs(true)
      }, ONE_DAY_MS)
    }
  }

  return {
    configs,
    loading,
    error,
    isStale,
    fetchConfigs,
    initConfigsRefresh,
  }
}
