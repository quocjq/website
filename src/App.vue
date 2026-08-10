<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppRightBar from './components/AppRightBar.vue'
import { useAuth } from './composables/useAuth'
import { useNotes } from './composables/useNotes'
import { currentNote, currentNoteId, notes } from './composables/store'

const { check } = useAuth()
const { selectNote } = useNotes()
check()

const route = useRoute()
const showRightBar = computed(() => route.name === 'reader')
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-(--bg)">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <RouterView />
    </div>
    <AppRightBar
      v-if="showRightBar"
      :note="currentNote"
      :notes="notes"
      :current-note-id="currentNoteId"
      @select="selectNote"
    />
  </div>
</template>
