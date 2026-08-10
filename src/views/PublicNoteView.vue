<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { apiFetch } from '../lib/api'
import type { StoredNote } from '../types'

const route = useRoute()
const note = ref<StoredNote | null>(null)
const notFound = ref(false)

onMounted(async () => {
  try {
    note.value = await apiFetch<StoredNote>(`/api/public/${route.params.id}`)
  } catch {
    notFound.value = true
  }
})
</script>

<template>
  <div class="flex flex-1 flex-col min-w-0">
    <AppHeader>
      <template #brand>
        <span class="flex items-center gap-1 font-semibold">lunatix <span class="text-(--accent)">notes</span></span>
      </template>
    </AppHeader>
    <div class="flex-1 overflow-y-auto">
      <div v-if="note" class="max-w-3xl mx-auto px-6 py-12">
        <RouterLink to="/notes" class="text-sm text-(--fg-muted) hover:text-(--accent)">← All notes</RouterLink>
        <h1 class="text-3xl font-bold mt-4 mb-2">{{ note.meta.title }}</h1>
        <p v-if="note.meta.date" class="text-sm text-(--fg-muted) mb-6">{{ note.meta.date }}</p>
        <div class="note-body max-w-none" v-html="note.html" />
      </div>
      <div v-else-if="notFound" class="flex flex-col items-center justify-center py-24">
        <p class="text-(--fg-muted)">Note not found</p>
        <RouterLink to="/notes" class="text-sm text-(--accent) mt-2">Back to notes</RouterLink>
      </div>
      <div v-else class="flex items-center justify-center py-24">
        <AppIcon name="loader" class="animate-spin text-(--fg-muted)" />
      </div>
    </div>
  </div>
</template>
