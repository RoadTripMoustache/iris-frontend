<template>
  <form class="card grid" style="gap:12px;" @submit.prevent="onSubmit">
    <h3>Nouvelle idée</h3>
    <input class="input" v-model="title" placeholder="Titre" required />
    <div class="row">
      <label class="meta" style="width:120px;">Catégorie</label>
      <select class="select" v-model="tag">
        <option value="bug">bug</option>
        <option value="enhancement">enhancement</option>
      </select>
    </div>
    <div class="row" style="justify-content: flex-end; gap:8px;">
      <button class="button" type="button" @click="$emit('cancel')">Annuler</button>
      <button class="button primary" :disabled="submitting">Créer</button>
    </div>
  </form>
</template>
<script setup lang="ts">
import type { CreateIdeaRequest } from '~/lib/models'
import { IdeasApi } from '~/lib/api'

const emit = defineEmits<{ (e:'created'): void; (e:'cancel'): void }>()
const title = ref('')
const tag = ref<'bug'|'enhancement'>('enhancement')
const submitting = ref(false)

const onSubmit = async () => {
  try {
    submitting.value = true
    await IdeasApi.create({ title: title.value, tag: tag.value } as CreateIdeaRequest)
    emit('created')
    title.value = ''
    tag.value = 'enhancement'
  } finally {
    submitting.value = false
  }
}
</script>
