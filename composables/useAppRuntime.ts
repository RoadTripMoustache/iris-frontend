import type {Ref} from 'vue'

export type PublicRuntime = {
  apiBaseUrl?: string
  appTitle?: string
  appLoginTitle?: string
  appIcon?: string
}

// Shared state to hold runtime-loaded public config
export function useAppRuntime(): Ref<PublicRuntime> {
  const state = useState<PublicRuntime>('app:publicRuntime', () => ({}));
  if (!state.value.appTitle) {
      state.value.appTitle = "Iris"
  }
  if (!state.value.appIcon) {
      state.value.appIcon = "/logo.png"
  }
  return state
}

export function getApiBaseUrl(): string {
  const cfg = useAppRuntime().value
  return (cfg.apiBaseUrl || '').replace(/\/$/, '')
}
