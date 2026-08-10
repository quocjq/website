<script setup lang="ts">
import { onMounted, watch } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import { useAuth } from '../composables/useAuth'
import { useNotes } from '../composables/useNotes'
import { currentNote, currentNoteId, noteNotFound } from '../composables/store'

const { authed, check } = useAuth()
const { notes, refresh, fetchNote } = useNotes()

watch(currentNoteId, (id) => {
  if (id) fetchNote(id)
})

watch(authed, async (now) => {
  if (!now) return
  await refresh()
  if (notes.value[0] && !currentNoteId.value) {
    currentNoteId.value = notes.value[0].id
  }
})

onMounted(async () => {
  await Promise.all([check(), refresh()])
  if (authed.value && notes.value[0] && !currentNoteId.value) {
    currentNoteId.value = notes.value[0].id
  }
})
</script>

<template>
  <div class="flex flex-1 flex-col min-w-0">
    <AppHeader>
      <template #brand>
        <span class="flex items-center gap-2 font-semibold">
          <span v-if="currentNote" class="truncate">{{ currentNote.meta.title }}</span>
          <span v-else class="text-(--accent)">notes</span>
        </span>
      </template>
    </AppHeader>

    <div class="flex-1 overflow-y-auto p-4 sm:p-10 reader-scroll">
      <div v-if="currentNote" class="mx-auto max-w-4xl">
        <div class="note-body" v-html="currentNote.html" />
      </div>
      <div v-else-if="noteNotFound" class="mx-auto max-w-4xl text-(--fg-muted) py-16 text-center">Note not found</div>
      <div v-else class="mx-auto max-w-4xl text-(--fg-muted) py-16 text-center">
        {{ authed ? 'Select a note' : 'Login to view notes' }}
      </div>
    </div>
  </div>
</template>
