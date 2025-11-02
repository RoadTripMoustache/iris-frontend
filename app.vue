<template>
    <AppNavbar v-if="isLoginPage"/>
    <div class="container">
      <NuxtPage/>
      <NuxtRouteAnnouncer />
    </div>
</template>

<script setup lang="ts">
import AppNavbar from "./components/menu/AppNavbar.vue";
import { useRoute } from 'vue-router'; // For Nuxt 3

let isLoginPage = ref(false);
const route = useRoute();

isLoginPage.value = !(route.name as string || "").startsWith("login_");

watch(
    () => route.path,
    () => {
      // Refresh data for a specific key, e.g., 'users-list'
      isLoginPage.value = !(route.name as string).startsWith("login_");
    }
);
</script>

<style scoped>
.container {
  padding-left: 20px;
  padding-right: 20px;
  width: calc(100% - 40px)
}
</style>