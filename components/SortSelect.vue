<template>
  <select class="select" v-model="model">
    <option value="created_at">{{ $t('home.sort_date') }}</option>
    <option value="votes_count">{{ $t('home.sort_votes') }}</option>
  </select>
</template>
<script setup lang="ts">
const props = defineProps<{ modelValue: 'created_at' | 'votes_count' }>()
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (v: 'created_at' | 'votes_count') => emit('update:modelValue', v)
})
</script>
