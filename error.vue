<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

router.push('/')
</script>

<template>
  <div class="error">Page not found</div>
</template>

<style scoped>
.error {
  width: 100%;
  margin-top: 100px;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
}
</style>