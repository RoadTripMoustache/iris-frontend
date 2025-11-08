<template>
  <div style="padding:16px; max-width:900px; margin:0 auto;">
    <h1>{{ $t('admins.title') }}</h1>

    <div v-if="loading" class="loading">{{ $t('admins.loading') }}</div>

    <div v-if="!loading">
      <section style="margin-bottom:24px;">
        <h2>{{ $t('admins.list_title') }}</h2>
        <div v-if="admins.length===0" class="empty">{{ $t('admins.empty') }}</div>
        <ul>
          <li v-for="a in admins" :key="a.user_email || a.uid" class="row" style="justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
            <div>
              <strong>{{ a.user_email || a.uid }}</strong>
              <div class="muted" v-if="a.uid">UID: {{ a.uid }}</div>
            </div>
            <div>
              <button class="button" @click="removeAdmin(a)">{{ $t('admins.remove') }}</button>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2>{{ $t('admins.add_title') }}</h2>
        <form @submit.prevent="onAdd">
          <div class="field">
            <label>{{ $t('admins.email_label') }}</label>
            <input v-model="newEmail" type="email" placeholder="admin@example.com" />
          </div>
          <div style="margin-top:12px;">
            <button class="button primary" :disabled="adding">{{ adding ? $t('admins.adding') : $t('admins.add') }}</button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="error" class="error" style="margin-top:12px;">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { AdminsApi } from '~/lib/api'

const { isAdmin, loading: authLoading } = useAuth()

const admins = ref<any[]>([])
const loading = ref(true)
const adding = ref(false)
const newEmail = ref('')
const error = ref<string | null>(null)
const { t } = useI18n()

useHead({ title: 'Admins' })

// Redirection si pas admin
onMounted(() => {
  // Attendre que auth soit initialisé
  const interval = setInterval(() => {
    if (!authLoading.value) {
      clearInterval(interval)
      if (!isAdmin.value) {
        navigateTo('/')
      } else {
        loadAdmins()
      }
    }
  }, 100)
})

async function loadAdmins() {
  loading.value = true
  error.value = null
  try {
    const data = await AdminsApi.list()
    admins.value = Array.isArray(data) ? data : []
  } catch (e:any) {
    console.error(e)
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

async function removeAdmin(a:any) {
  if (!confirm(t('admins.confirm_deletion'))) return
  try {
    await AdminsApi.remove({ user_email: a.user_email, uid: a.uid })
    // Retirer localement
    admins.value = admins.value.filter(it => it.user_email !== a.user_email)
  } catch (e:any) {
    console.error(e)
    error.value = e?.message || String(e)
  }
}

async function onAdd() {
  if (!newEmail.value) return
  adding.value = true
  error.value = null
  try {
    await AdminsApi.add({ user_email: newEmail.value })
    newEmail.value = ''
    await loadAdmins()
  } catch (e:any) {
    console.error(e)
    error.value = e?.message || String(e)
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.field input { padding:8px; width:100%; box-sizing:border-box; }
.row { display:flex; }
.muted { color: #666; font-size: 0.9em; }
.empty { color: #666; }
.error { color: #b00020; }
.loading { color: #666; }
</style>
