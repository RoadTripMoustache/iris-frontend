<template>
  <div class="row" style="gap:8px;">
    <input class="input" :placeholder="placeholder" v-model="model" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v)
})
</script>
