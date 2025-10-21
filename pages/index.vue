<template>
  <div class="grid" style="gap:16px; padding-top:16px;">
    <div class="row" style="gap:12px;">
      <SearchBar style="flex:1" v-model="search" placeholder="Rechercher une idée..." />
      <SortSelect v-model="sortBy" />
    </div>

    <IdeaForm v-if="showNew" @cancel="onCancelNew" @created="onCreated" />

    <InfiniteScroller :loadMore="loadMore" :loading="loading" :done="done">
      <div class="grid">
        <IdeaCard v-for="it in filteredSortedIdeas" :key="it.id" :idea="it" @update="onItemUpdate(it, $event)" />
      </div>
      <div v-if="!filteredSortedIdeas.length && !loading" class="empty">Aucune idée</div>
    </InfiniteScroller>
  </div>
</template>
<script setup lang="ts">
import type { Idea } from '../lib/models'
import { IdeasApi } from '../lib/api'
import {useAuth} from "../composables/useAuth";

const { isAdmin } = useAuth()
const route = useRoute()
const router = useRouter()

const ideas = ref<Idea[]>([])
const page = ref(1)
const pageSize = 20
const loading = ref(false)
const done = ref(false)
const search = ref('')
const sortBy = ref<'created_at'|'votes_count'>('created_at')

const showNew = computed(() => route.query.new === '1')
function onCancelNew() { router.replace({ query: { ...route.query, new: undefined } }) }
async function onCreated() {
  router.replace({ query: { ...route.query, new: undefined } })
  // reload from first page
  ideas.value = []
  page.value = 1
  done.value = false
  await loadMore(true)
}

const filteredSortedIdeas = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = ideas.value.filter(it => !q || it.title.toLowerCase().includes(q))
  if (!isAdmin.value) list = list.filter(it => it.is_open)
  list = list.slice().sort((a,b) => {
    if (sortBy.value === 'created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return (b.votes_count||0) - (a.votes_count||0)
  })
  return list
})

function onItemUpdate(oldItem: Idea, updated: Idea) {
  const idx = ideas.value.findIndex(i => i.id === oldItem.id)
  if (idx >= 0) ideas.value[idx] = updated
}

async function loadMore(reset = false) {
  if (loading.value || done.value) return
  loading.value = true
  try {
    const data = await IdeasApi.list(page.value, pageSize)
    if (reset) {
      ideas.value = data
    } else {
      ideas.value.push(...data)
    }
    if (data.length < pageSize) done.value = true
    else page.value += 1
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMore()
})
</script>
