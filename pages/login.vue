<template>
  <div class="container" style="max-width:420px; padding-top:56px;">
    <div class="card grid" style="gap:16px;">
      <h2>Se connecter</h2>
      <form @submit.prevent="onSubmit" class="grid" style="gap:12px;">
        <input class="input" v-model="email" type="email" placeholder="Email" required />
        <input class="input" v-model="password" type="password" placeholder="Mot de passe" required />
        <button class="button primary" :disabled="submitting">Connexion</button>
      </form>
      <div class="row" style="justify-content: center;">
        <button class="button" @click="onGoogle" :disabled="submitting">Continuer avec Google</button>
      </div>
      <p v-if="error" class="meta" style="color: var(--danger)">{{ error }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
useHead({ title: "Iris | Se connecter" })
import {useAuth} from "../composables/useAuth";

const { user, signInWithEmail, signInWithGoogle } = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

watchEffect(() => {
  if (user.value) router.push('/')
})

const onSubmit = async () => {
  try {
    submitting.value = true
    error.value = ''
    await signInWithEmail(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Erreur de connexion'
  } finally {
    submitting.value = false
  }
}

const onGoogle = async () => {
  try {
    submitting.value = true
    error.value = ''
    await signInWithGoogle()
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Erreur Google'
  } finally {
    submitting.value = false
  }
}
</script>
