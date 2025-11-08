<template>
  <div class="comment">
    <div class="row" style="justify-content: space-between;">
      <div class="meta">{{ formatDate(comment.created_at) }}</div>
      <div class="row" v-if="canEdit">
        <button class="button ghost" @click="editing = !editing">{{ editing ? $t('comment.cancel') : $t('comment.edit') }}</button>
        <button class="button ghost" style="color: var(--danger)" @click="$emit('delete', comment.id)">{{ $t('comment.delete') }}</button>
      </div>
    </div>
    <div v-if="!editing">
      <div>{{ comment.message }}</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        <ImageCard v-for="(url, idx) in images" :image="url" :index="idx" :is-creation-form="false" :on-delete="onImageDeleted"></ImageCard>
      </div>
    </div>
    <div v-else class="grid" style="gap:8px;">
      <textarea class="input" v-model="draft" rows="3"></textarea>

      <ImageSelection :is-idea="false" :images="images" :update-images="onImagesUpdate" :update-error="onUpdateError"/>

      <p v-if="error" class="error">{{ error }}</p>
      <div>
        <button class="button primary" @click="save">{{ $t('comment.save') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import type { Comment } from '~/lib/models'
import ImageSelection from "~/components/form/ImageSelection.vue";
import ImageCard from "~/components/idea/ImageCard.vue";

const props = defineProps<{ comment: Comment; canEdit: boolean }>()
const emit = defineEmits<{ (e:'update', id:string, message:string, images: string[]): void }>()
const editing = ref(false)
const draft = ref(props.comment.message)
const images = ref<string[]>(props.comment.images || [])
const error = ref<string>('')

watch(() => props.comment.message, (v) => draft.value = v)

function formatDate(s: string) { return dayjs(s).format('DD/MM/YYYY HH:mm') }

function onImageDeleted(url: string) {
}

function save() {
  if (error.value == "") {
    emit('update', props.comment.id, draft.value, images.value)
    editing.value = false
  }
}


function onUpdateError(newError: string) {
  error.value = newError;
}

function onImagesUpdate(newImageList: string []) {
  images.value = newImageList;
}
</script>
