<template>
  <div class="grid" style="gap:16px; padding-top:16px;">
    <IdeaForm @cancel="goHome" @created="onCreated" />
  </div>
</template>
<script setup lang="ts">
const router = useRouter()
function goHome() { router.push('/') }
function onCreated() { router.push('/') }
</script>
