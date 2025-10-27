<template>
    <AppNavbar />
    <div class="container">
      <NuxtPage/>
      <NuxtRouteAnnouncer />
    </div>
</template>

<script setup lang="ts">
import AppNavbar from "./components/menu/AppNavbar.vue";
</script>

<style scoped>
.container {
  padding-left: 20px;
  padding-right: 20px;
  width: calc(100% - 40px)
}
</style>