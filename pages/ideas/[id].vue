<template>
  <div class="grid" style="gap:16px; padding-top:16px;">
    <IdeaCard v-if="idea" :idea="idea" @update="(val)=> idea = val">
      <div class="row" style="justify-content: space-between;">
        <div class="meta">{{ idea?.voters.length }} {{ $t('idea.voters', idea?.voters.length) }} • {{ idea?.comments.length }} {{ $t('idea.comments', idea?.comments.length) }}</div>
        <div class="row" v-if="isAdmin">
          <button class="button" @click="toggleOpen">{{ idea?.is_open ? $t('idea.close') : $t('idea.open_action') }}</button>
        </div>
      </div>
    </IdeaCard>

    <div class="card" v-if="idea">
      <h3>{{ $t('idea.comments_heading') }}</h3>
      <div v-if="!idea.comments.length" class="empty">{{ $t('idea.no_comments') }}</div>
      <div v-else>
        <CommentItem v-for="c in idea.comments" :key="c.id" :comment="c" :canEdit="canEdit(c.user_id)" @update="onEditComment" @delete="onDeleteComment" />
      </div>
      <hr class="sep" />
      <form class="grid" style="gap:8px;" @submit.prevent="onAddComment">
        <textarea class="input" v-model="newComment" :placeholder="$t('idea.add_comment_placeholder')" rows="3"></textarea>
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
const { t } = useI18n()

const { user, isAdmin } = useAuth()
const route = useRoute()

const idea = ref<Idea | null>(null)
const newComment = ref('')

function updateTitle(ideaName: string) {
  useHead({ title: "Iris | " + ideaName })
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
  const updated = await IdeasApi.addComment(idea.value.id, { message: newComment.value })
  idea.value = updated
  newComment.value = ''
}

async function onEditComment(id: string, message: string) {
  if (!idea.value) return
  const updated = await IdeasApi.editComment(idea.value.id, id, { message })
  idea.value = updated
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

onMounted(fetchIdea)
</script>
