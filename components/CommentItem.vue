<template>
  <div class="comment">
    <div class="row" style="justify-content: space-between;">
      <div class="meta">{{ formatDate(comment.created_at) }}</div>
      <div class="row" v-if="canEdit">
        <button class="button ghost" @click="editing = !editing">{{ editing ? 'Annuler' : 'Modifier' }}</button>
        <button class="button ghost" style="color: var(--danger)" @click="$emit('delete', comment.id)">Supprimer</button>
      </div>
    </div>
    <div v-if="!editing">{{ comment.message }}</div>
    <div v-else class="grid" style="gap:8px;">
      <textarea class="input" v-model="draft" rows="3"></textarea>
      <div>
        <button class="button primary" @click="save">Enregistrer</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import type { Comment } from '~/lib/models'

const props = defineProps<{ comment: Comment; canEdit: boolean }>()
const emit = defineEmits<{ (e:'update', id:string, message:string): void }>()
const editing = ref(false)
const draft = ref(props.comment.message)

watch(() => props.comment.message, (v) => draft.value = v)

function formatDate(s: string) { return dayjs(s).format('DD/MM/YYYY HH:mm') }

function save() {
  emit('update', props.comment.id, draft.value)
  editing.value = false
}
</script>
