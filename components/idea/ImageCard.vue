<template>
  <div class="imgCard">
    <img :src="baseUrl() + props.image" :alt="`Idea image ${index}`" />
    <span class="material-icons" v-on:click="deleteImage(props.image)" v-if="isCreationForm">close</span>
  </div>
</template>
<style scoped>
.imgCard {
  position: relative;
  height:120px;
  max-width:120px;
}

.imgCard img {
  height:120px;
  max-width:120px;
  border-radius:8px;
  object-fit:cover;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 20px; /* Example size */
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px;
  cursor: pointer;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style>
<script setup lang="ts">
import { ImagesApi } from '~/lib/api'

const props = defineProps<{
  image: string,
  index: number,
  isCreationForm: boolean,
  onDelete: Function
}>()

function baseUrl() {
  return getApiBaseUrl()
}

function deleteImage(image: string) {
  ImagesApi.delete(image)
  props.onDelete(image)
}
</script>
