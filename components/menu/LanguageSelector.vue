<template>
    <select class="select" v-model="locale" @change="setLocale(String(locale))" style="min-width:120px;">
      <option v-for="l in locales"
              :key="l.code"
              :value="l.code">{{ l.name }}</option>
    </select>
</template>
<script setup lang="ts">
const { locale, setLocale, locales } = useI18n()
</script>
