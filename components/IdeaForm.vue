<template>
  <form class="card grid" style="gap:12px;" @submit.prevent="onSubmit">
    <h3>Nouvelle idée</h3>
    <input class="input" v-model="title" placeholder="Titre" />
    <textarea class="input" v-model="description" rows="4" placeholder="Description"></textarea>

    <div class="row">
      <label class="meta" style="width:120px;">Catégorie</label>
      <select class="select" v-model="tag">
        <option value="bug">bug</option>
        <option value="enhancement">enhancement</option>
      </select>
    </div>

    <div class="grid" style="gap:8px;">
      <label class="meta">Images (.jpg, .png, < 2Mo)</label>
      <input type="file" multiple accept="image/png,image/jpeg" @change="onFilesSelected" />
      <div v-if="images.length" class="row wrap" style="gap:8px;">
        <span v-for="(url, idx) in images" :key="idx" class="chip">{{ url }}</span>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div class="row" style="justify-content: flex-end; gap:8px;">
      <button class="button" type="button" @click="$emit('cancel')">Annuler</button>
      <button class="button primary" :disabled="submitting">Créer</button>
    </div>
  </form>
</template>
<script setup lang="ts">
import type { CreateIdeaRequest } from '~/lib/models'
import { IdeasApi, ImagesApi } from '~/lib/api'

const emit = defineEmits<{ (e:'created'): void; (e:'cancel'): void }>()
const title = ref('')
const description = ref('')
const tag = ref<'bug'|'enhancement'>('enhancement')
const images = ref<string[]>([])
const submitting = ref(false)
const error = ref<string>('')

async function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files) return
  error.value = ''
  for (const file of Array.from(files)) {
    const validType = ['image/jpeg','image/png'].includes(file.type)
    const validSize = file.size <= 2 * 1024 * 1024
    if (!validType) { error.value = 'Format d\'image non supporté.'; continue }
    if (!validSize) { error.value = 'Image trop volumineuse (> 2Mo).'; continue }
    try {
      const { url } = await ImagesApi.upload(file)
      images.value.push(url)
    } catch (e:any) {
      error.value = e?.message || 'Échec de l\'upload de l\'image.'
    }
  }
  // reset input value to allow re-selecting the same files
  input.value = ''
}

const onSubmit = async () => {
  error.value = ''
  const t = title.value.trim()
  const d = description.value.trim()
  if (!t || !d) {
    error.value = 'Le titre et la description sont obligatoires.'
    return
  }
  try {
    submitting.value = true
    await IdeasApi.create({ title: t, tag: tag.value, description: d, images: images.value } as CreateIdeaRequest)
    emit('created')
    title.value = ''
    description.value = ''
    images.value = []
    tag.value = 'enhancement'
  } catch (e:any) {
    error.value = e?.message || 'Erreur lors de la création de l\'idée.'
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>
.error { color: #b00020; }
.chip { background:#eee; padding:2px 6px; border-radius:6px; font-size:12px; }
</style>
