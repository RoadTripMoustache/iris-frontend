export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const appTitle = config.public.appTitle || 'Iris'
  const appIcon = config.public.appIcon || '/logo.png'

  useHead({
    titleTemplate: (titleChunk?: string) => {
      return titleChunk ? `${appTitle} | ${titleChunk}` : appTitle
    },
    link: [
      { rel: 'icon', type: 'image/png', href: appIcon }
    ]
  })
})