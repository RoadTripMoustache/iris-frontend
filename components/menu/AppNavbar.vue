<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <div class="brand" v-on:click="goTo('/')">
        <img :src="icon" :alt="title" />
        <span>{{ title }}</span>
      </div>
      <div class="row" style="gap:8px; align-items:center;">
        <div class="row" style="gap:8px">
          <span class="meta">{{ user.email }}</span>
          <button v-if="isAdmin" class="button" @click="goAdmin">{{ $t('nav.admins') }}</button>
          <LanguageSelector />
          <button class="button" @click="logout">{{ $t('nav.logout') }}</button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import {useAuth} from "~~/composables/useAuth";
import LanguageSelector from "~/components/menu/LanguageSelector.vue";

const runtime = useAppRuntime()
const title = runtime.value.appTitle
const icon = runtime.value.appIcon
const { t } = useI18n();
const { isAdmin } = useAuth()

const goTo = (path) => {
  const localePath = useLocalePath()
  navigateTo(localePath(path));
};

const { user, signOut } = useAuth()

const goAdmin = () => goTo('/admins')
const logout = async () => {
  const userConfirmed: boolean = window.confirm(t("nav.logout_confirm"));

  if (userConfirmed) {
    await signOut()
    goTo('/login')
  }
}
</script>
<style scoped>
.brand {
  cursor: pointer;
}
</style>