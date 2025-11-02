<template>
  <div>
    <slot />
    <div ref="sentinel" class="loading" v-if="!done">{{ loading ? 'Chargement...' : '' }}</div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ loadMore: () => Promise<void>; loading: boolean; done: boolean }>()
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !props.loading && !props.done) {
        await props.loadMore()
      }
    }
  })
  if (sentinel.value) observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value)
})
</script>
