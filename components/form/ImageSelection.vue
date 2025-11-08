<script setup lang="ts">

import type {Comment} from "~/lib/models";

const props = defineProps<{
  images: string[];
  updateImages: Function;
  updateError: Function;
}>()

import ImageCard from "~/components/idea/ImageCard.vue";
import {useConfigs} from "~/composables/useConfigs";
import {ImagesApi} from "~/lib/api";
const { t } = useI18n()
const {configs} = useConfigs()

function acceptedExtensions() {
  return configs?.value?.accepted_extensions.join(', ') || 'png, jpeg'
}

function buildLabel() {
  let extensions = acceptedExtensions()
  let maxBytes = formatBytes(configs?.value?.max_size || 2 * 1024 * 1024)

  return " ("+extensions+", > "+ maxBytes +")"
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 octet";

  const units = ["octets", "Ko", "Mo", "Go", "To"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  // Arrondir à 2 décimales maximum
  const formatted = value.toFixed(2).replace(/\.00$/, "");

  return `${formatted} ${units[i]}`;
}



async function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files) return
  props.updateError("")
  for (const file of Array.from(files)) {
    const validType = ['image/jpeg','image/png'].includes(file.type)
    const validSize = file.size <= 2 * 1024 * 1024
    if (!validType) { props.updateError(t('idea.error_type')); continue }
    if (!validSize) { props.updateError(t('idea.error_size')); continue }
    try {
      const { url } = await ImagesApi.upload(file)
      props.images.push(url)
      props.updateImages(props.images)
    } catch (e:any) {
      let errorReponse = JSON.parse(e?.message || '')
      props.updateError(t("error."+errorReponse["error_code"]) || (t('idea.error_upload') as string))
    }
  }
  // reset input value to allow re-selecting the same files
  input.value = ''
}

function onImageDeleted(url: string) {
  props.updateImages(props.images.filter(i => i.trim() !== url.trim()))
}
</script>

<template>
  <div class="grid" style="gap:8px;">
    <label class="meta">{{ $t('idea.images_label') + buildLabel()}}</label>
    <input type="file" multiple :accept="acceptedExtensions()" @change="onFilesSelected" v-if="images.length < (configs?.max_images_per_idea || 5)" />
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      <ImageCard v-for="(url, idx) in images" :image="url" :index="idx" :is-creation-form="true" :on-delete="onImageDeleted"></ImageCard>
    </div>
  </div>

</template>

<style scoped>
</style>