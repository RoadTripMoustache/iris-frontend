<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <div class="brand" v-on:click="goTo('/')">
        <img :src="icon" :alt="title" />
        <span>{{ title }}</span>
      </div>
      <div class="row" style="gap:8px; align-items:center;">
        <button v-if="!user" class="button" @click="goLogin">{{ $t('nav.login') }}</button>
        <div v-else class="row" style="gap:8px">
          <span class="meta">{{ user.email }}</span>
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

const goTo = (path) => {
  const localePath = useLocalePath()
  navigateTo(localePath(path));
};

const { user, signOut } = useAuth()

const goLogin = () => goTo('/login')
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