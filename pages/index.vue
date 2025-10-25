<template>
  <div class="grid" style="gap:16px; padding-top:16px;">
    <div class="row" style="gap:12px; align-items:center;">
      <SearchBar style="flex:1" v-model="search" :placeholder="$t('home.search_placeholder')" />
      <SortSelect v-model="sortBy" />
      <NuxtLink class="button primary" to="/ideas/new">{{ $t('home.new_idea') }}</NuxtLink>
    </div>

    <InfiniteScroller :loadMore="loadMore" :loading="loading" :done="done">
      <div class="grid">
        <IdeaCard v-for="it in filteredSortedIdeas" :key="it.id" :idea="it" @update="onItemUpdate(it, $event)" />
      </div>
      <div v-if="filteredSortedIdeas!=undefined && !filteredSortedIdeas.length && !loading" class="empty">{{ $t('home.empty') }}</div>
    </InfiniteScroller>
  </div>
</template>
<script setup lang="ts">
import type { Idea } from '../lib/models'
import { IdeasApi } from '../lib/api'
import {useAuth} from "../composables/useAuth";
const { t } = useI18n()
useHead({ title: t('home.title') as string })

const { isAdmin } = useAuth()

const ideas = ref<Idea[]>([])
const page = ref(1)
const pageSize = 20
const loading = ref(false)
const done = ref(false)
const search = ref('')
const sortBy = ref<'created_at'|'votes_count'>('created_at')

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
  
  // Recharger toute la liste après un vote/unvote
  refreshIdeas()
}

async function refreshIdeas() {
  page.value = 1
  done.value = false
  await loadMore(true)
}

async function loadMore(reset = false) {
  if (loading.value || done.value) return
  loading.value = true
  try {
    const data = await IdeasApi.list(page.value, pageSize)
    // Vérifier que data est bien un tableau
    const safeData = Array.isArray(data.data) ? data.data : []
    if (reset) {
      ideas.value = safeData
    } else {
      ideas.value.push(...safeData)
    }
    if (safeData.length < pageSize) {
      done.value = true
    } else {
      page.value += 1
    }
  } catch (e) {
    console.error(e)
    done.value = true // Arrêter le chargement en cas d'erreur
  } finally {
    loading.value = false
  }
}

// Ne charger les données que côté client
onMounted(() => {
  if (process.client) {
    loadMore()
  }
})
</script>
