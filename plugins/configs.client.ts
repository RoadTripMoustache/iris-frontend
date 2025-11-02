import { useConfigs } from '~/composables/useConfigs'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const { initConfigsRefresh } = useConfigs()
    initConfigsRefresh()
  }
})
