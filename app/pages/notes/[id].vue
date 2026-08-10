<script setup lang="ts">
const route = useRoute()
const note = ref<{ meta: any, html: string } | null>(null)
const notFound = ref(false)

onMounted(async () => {
  try {
    const { $csrfFetch } = useNuxtApp()
    const fetcher: any = $csrfFetch || $fetch
    note.value = await fetcher(`/api/public/${route.params.id}`)
  } catch {
    notFound.value = true
  }
})
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div v-if="note" class="max-w-3xl mx-auto px-6 py-12">
      <NuxtLink to="/notes" class="text-sm text-(--ui-text-muted) hover:text-(--ui-primary)">← All notes</NuxtLink>
      <h1 class="text-3xl font-bold mt-4 mb-2">{{ note.meta.title }}</h1>
      <p v-if="note.meta.date" class="text-sm text-(--ui-text-muted) mb-6">{{ note.meta.date }}</p>
      <div class="note-body max-w-none" v-html="note.html" />
    </div>
    <div v-else-if="notFound" class="flex flex-col items-center justify-center py-24">
      <p class="text-(--ui-text-muted)">Note not found</p>
      <NuxtLink to="/notes" class="text-sm text-(--ui-primary) mt-2">Back to notes</NuxtLink>
    </div>
    <div v-else class="flex items-center justify-center py-24">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-(--ui-text-muted)" />
    </div>
  </div>
</template>
