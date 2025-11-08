<template>
  <div class="grid" style="gap:16px; padding-top:16px;">
    <IdeaCard v-if="idea" :idea="idea" @update="(val)=> idea = val">
      <div class="row" style="justify-content: space-between;">
        <div class="meta">{{ idea?.voters.length }} {{ $t('idea.voters', idea?.voters.length) }} • {{ idea?.comments.length }} {{ $t('idea.comments', idea?.comments.length) }}</div>
        <div class="row" v-if="isAdmin">
          <button class="button" @click="toggleOpen">{{ idea?.is_open ? $t('idea.close') : $t('idea.open_action') }}</button>
        </div>
      </div>
      <div class="row">
        {{idea.description}}
      </div>
    </IdeaCard>

    <div class="card" v-if="idea && idea.images && idea.images.length">
      <div class="row wrap" style="gap:8px;">
        <a v-for="(img, idx) in idea.images" :key="idx" :href="baseUrl() + img" target="_blank" rel="noopener">
          <img :src="baseUrl() + img" :alt="`Idea image ${idx+1}`" style="height:120px; max-width:180px; border-radius:8px; object-fit:cover;" />
        </a>
      </div>
    </div>

    <div class="card" v-if="idea">
      <h3 style="margin-top: 0px;">{{ $t('idea.comments_heading') }}</h3>
      <div v-if="!idea.comments.length" class="empty">{{ $t('idea.no_comments') }}</div>
      <div v-else>
        <CommentItem v-for="c in idea.comments" :key="c.id" :comment="c" :canEdit="canEdit(c.user_id)" @update="onEditComment" @delete="onDeleteComment" />
      </div>
      <hr class="sep" />
      <form class="grid" style="gap:8px;" @submit.prevent="onAddComment">
        <textarea class="input" v-model="newComment" :placeholder="$t('idea.add_comment_placeholder')" rows="3"></textarea>

        <ImageSelection :images="images" :update-images="onImagesUpdate" :update-error="onUpdateError"/>

        <p v-if="error" class="error">{{ error }}</p>
        <div class="row" style="justify-content: flex-end;">
          <button class="button primary" :disabled="!newComment.trim()">{{ $t('idea.publish') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Idea } from '~/lib/models'
import { IdeasApi } from '~/lib/api'
import ImageSelection from "~/components/form/ImageSelection.vue";

function baseUrl() {
  return getApiBaseUrl()
}

const { user, isAdmin } = useAuth()
const route = useRoute()

const idea = ref<Idea | null>(null)
const newComment = ref('')
const images = ref<string[]>([])
const error = ref<string>('')

function updateTitle(ideaName: string) {
  useHead({ title: ideaName })
}
updateTitle("")
async function fetchIdea() {
  idea.value = await IdeasApi.getOne(route.params.id as string)
  updateTitle(idea.value.title)
}

function canEdit(userId: string) {
  return user.value?.uid === userId || isAdmin.value
}

async function onAddComment() {
  if (!idea.value) return
  const updated = await IdeasApi.addComment(idea.value.id, { message: newComment.value, images: images.value })
  idea.value = updated
  newComment.value = ''
  images.value = []
}

async function onEditComment(id: string, message: string, imageList: string[]) {
  if (!idea.value) return
  const updated = await IdeasApi.editComment(idea.value.id, id, { message, images: imageList })
  idea.value = updated
  images.value = []
}

async function onDeleteComment(id: string) {
  if (!idea.value) return
  const updated = await IdeasApi.deleteComment(idea.value.id, id)
  idea.value = updated
}

async function toggleOpen() {
  if (!idea.value) return
  const updated = await IdeasApi.setOpen(idea.value.id, !idea.value.is_open)
  idea.value = updated
}

function onUpdateError(newError: string) {
  error.value = newError;
}

function onImagesUpdate(newImageList: string []) {
  images.value = newImageList;
}

onMounted(fetchIdea)
</script>
