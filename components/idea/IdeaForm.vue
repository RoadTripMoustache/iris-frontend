<template>
  <form class="card grid" style="gap:12px;" @submit.prevent="onSubmit">
    <h3>{{ $t('idea.new_heading') }}</h3>
    <input class="input" v-model="title" :placeholder="$t('idea.title')" />
    <textarea class="input" v-model="description" rows="4" :placeholder="$t('idea.description')"></textarea>

    <div class="row">
      <label class="meta" style="width:120px;">{{ $t('idea.category') }}</label>
      <select class="select" v-model="tag">
        <option value="enhancement">{{ $t('tags.enhancement') }}</option>
        <option value="bug">{{ $t('tags.bug') }}</option>
      </select>
    </div>

    <ImageSelection :images="images" :update-images="onImagesUpdate" :update-error="onUpdateError"/>

    <p v-if="error" class="error">{{ error }}</p>

    <div class="row" style="justify-content: flex-end; gap:8px;">
      <button class="button" type="button" @click="$emit('cancel')">{{ $t('idea.cancel') }}</button>
      <button class="button primary" :disabled="submitting">{{ $t('idea.create') }}</button>
    </div>
  </form>
</template>
<script setup lang="ts">
import type { CreateIdeaRequest } from '~/lib/models'
import { IdeasApi } from '~/lib/api'
import ImageSelection from "~/components/form/ImageSelection.vue";
const { t } = useI18n()

const emit = defineEmits<{ (e:'created'): void; (e:'cancel'): void }>()
const title = ref('')
const description = ref('')
const tag = ref<'bug'|'enhancement'>('enhancement')
const images = ref<string[]>([])
const submitting = ref(false)
const error = ref<string>('')

const onSubmit = async () => {
  error.value = ''
  const ti = title.value.trim()
  const d = description.value.trim()
  if (!ti || !d) {
    error.value = t('idea.error_required') as string
    return
  }
  try {
    submitting.value = true
    console.log("Creating idea", { title: ti, tag: tag.value, description: d, images: images.value })
    await IdeasApi.create({ title: ti, tag: tag.value, description: d, images: images.value } as CreateIdeaRequest)
    emit('created')
    title.value = ''
    description.value = ''
    images.value = []
    tag.value = 'enhancement'
  } catch (e:any) {
    let errorReponse = JSON.parse(e?.message || '')
    error.value = t("error."+errorReponse["error_code"]) || (t('idea.error_create') as string)
  } finally {
    submitting.value = false
  }
}

function onUpdateError(newError: string) {
  error.value = newError;
}

function onImagesUpdate(newImageList: string []) {
  images.value = newImageList;
}
</script>
<style scoped>
.error { color: #b00020; }
</style>
