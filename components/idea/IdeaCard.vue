<template>
  <div class="card idea-card">
    <div class="idea-vote">
      <div style="font-size:18px; font-weight:700;">{{ idea.votes_count }}</div>
      <button class="button" :class="{ primary: idea.user_has_voted }" @click="toggleVote" :disabled="!idea.is_open && !idea.user_has_voted">
        {{ idea.user_has_voted ? $t('idea.unvote') : $t('idea.vote') }}
      </button>
    </div>
    <div class="idea-content">
      <div class="row" style="justify-content: space-between;">
        <a @click="goTo(`/ideas/${idea.id}`)" style="font-weight:600; text-decoration:none; color:inherit;">
          {{ idea.title }}
        </a>
        <span :class="'badge '+ idea.tag ">{{ $t('tags.'+ idea.tag) }}</span>
      </div>
      <div class="meta">{{ $t('idea.created_on') }} {{ formatDate(idea.created_at) }} • {{ idea.is_open ? $t('idea.open') : $t('idea.closed') }}</div>
      <slot />
    </div>
  </div>
</template>
<style>
.bug {
  background-color: #ffbcbc;
  border-color: #cc7f7f;
}
.enhancement {
  background-color: #c1ecff;
  border-color: #6a9ac1;
}
</style>
<script setup lang="ts">
import dayjs from 'dayjs'
import type { Idea } from '~/lib/models'
import { IdeasApi } from '~/lib/api'

const props = defineProps<{ idea: Idea }>()
const emit = defineEmits<{ (e:'update', value: Idea): void }>()

const goTo = (path) => {
  const localePath = useLocalePath()
  navigateTo(localePath(path));
};

function formatDate(s: string) {
  return dayjs(s).format('DD/MM/YYYY')
}

const toggleVote = async () => {
  try {
    const updated = props.idea.user_has_voted ? await IdeasApi.unvote(props.idea.id) : await IdeasApi.vote(props.idea.id)
    emit('update', updated)
  } catch (e) {
    console.error(e)
  }
}
</script>
