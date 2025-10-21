<template>
  <div>
    <AppNavbar />
    <div class="container">
      <NuxtPage />
    </div>
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from "~~/components/AppNavbar.vue";
</script>