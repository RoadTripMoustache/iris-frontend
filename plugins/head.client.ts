export default defineNuxtPlugin(() => {
  const runtime = useAppRuntime()
  const appTitle = runtime.value.appTitle || 'Iris'
  const appIcon = runtime.value.appIcon || '/logo.png'

  useHead({
    titleTemplate: (titleChunk?: string) => {
      return titleChunk ? `${appTitle} | ${titleChunk}` : appTitle
    },
    link: [
      { rel: 'icon', type: 'image/png', href: appIcon }
    ]
  })
})