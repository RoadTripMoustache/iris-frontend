<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <NuxtLink class="brand" to="/">
        <img src="/logo.svg" alt="Iris" />
        <span>Iris</span>
      </NuxtLink>
      <div class="row">
        <button v-if="!user" class="button" @click="goLogin">Se connecter</button>
        <div v-else class="row" style="gap:8px">
          <span class="meta">{{ user.email }}</span>
          <button class="button" @click="goNewIdea">Nouvelle idée</button>
          <button class="button" @click="logout">Se déconnecter</button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
const router = useRouter()
const { user, signOut } = useAuth()

const goLogin = () => router.push('/login')
const goNewIdea = () => router.push({ path: '/', query: { new: '1' } })
const logout = async () => {
  await signOut()
  router.push('/login')
}
</script>
