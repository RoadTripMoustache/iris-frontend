<template>
    <select class="select" v-model="localeCode" @change="handleLocaleChange" style="min-width:120px;">
      <option v-for="l in locales"
              :key="l.code"
              :value="l.code">{{ l.name }}</option>
    </select>
</template>
<script setup lang="ts">

const { locale, setLocale, locales } = useI18n()
let localeCode = locale.value

function handleLocaleChange(event) {
  localeCode = event.target.value
  setLocale(event.target.value)
}

</script>
