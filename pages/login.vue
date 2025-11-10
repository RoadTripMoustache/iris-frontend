<template>
  <div class="container" style="max-width:420px; padding-top:56px;">
    <div class="card grid" style="gap:16px;">
      <div style="text-align:center;">
      <img :src="icon" :alt="title" />
      <h1>{{ title }}</h1>
      <h3>{{ loginTitle || $t('login.support_title') }}</h3>
      </div>
      <form @submit.prevent="onSubmit" class="grid" style="gap:12px;">
        <input class="input" v-model="email" type="email" :placeholder="$t('login.email')" required />
        <input class="input" v-model="password" type="password" :placeholder="$t('login.password')" required />
        <button class="button primary" :disabled="submitting">{{ $t('login.submit') }}</button>
      </form>
      <div class="row" style="justify-content: center;">
        <button class="button" @click="onGoogle" :disabled="submitting" :title="t('login.continue_google')">
          <GoogleLogo/>
        </button>

      </div>
      <p v-if="error" class="meta" style="color: var(--danger)">{{ error }}</p>

        <LanguageSelector />
    </div>
  </div>
</template>
<style scoped>
.button {
  border:none;
}
</style>
<script setup lang="ts">
import GoogleLogo from "~/components/logos/GoogleLogo.vue";
import {useAuth} from "~/composables/useAuth";
import LanguageSelector from "~/components/menu/LanguageSelector.vue";

const { t } = useI18n()
const { user, signInWithEmail, signInWithGoogle } = useAuth()
const runtime = useAppRuntime()

const title = runtime.value.appTitle
const icon = runtime.value.appIcon
const loginTitle = runtime.value.appLoginTitle
const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

useHead({ title: t('login.title') as string })

const goTo = (path: string) => {
  const localePath = useLocalePath()
  navigateTo(localePath(path));
};

watchEffect(() => {
  if (user.value) goTo('/')
})

const onSubmit = async () => {
  try {
    submitting.value = true
    error.value = ''
    await signInWithEmail(email.value, password.value)
    goTo('/')
  } catch (e: any) {
    error.value = e.message || t('login.error_login')
  } finally {
    submitting.value = false
  }
}

const onGoogle = async () => {
  try {
    submitting.value = true
    error.value = ''
    await signInWithGoogle()
    goTo('/')
  } catch (e: any) {
    error.value = e.message || t('login.error_google')
  } finally {
    submitting.value = false
  }
}
</script>
