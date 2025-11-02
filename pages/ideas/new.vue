<template>
  <div class="grid" style="gap:16px; padding-top:16px;">
    <IdeaForm @cancel="goHome" @created="onCreated" />
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

useHead({ title: t('idea.new_title') as string })
function goHome() { goTo('/') }
function onCreated() { goTo('/') }


const goTo = (path) => {
  const localePath = useLocalePath()
  navigateTo(localePath(path));
};
</script>
