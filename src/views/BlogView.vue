<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { apiFetch } from '../lib/api'
import type { NoteMeta } from '../types'

const publicNotes = ref<NoteMeta[]>([])
const loading = ref(true)

onMounted(async () => {
  publicNotes.value = await apiFetch<NoteMeta[]>('/api/public')
  loading.value = false
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
      <div class="max-w-3xl mx-auto px-6 py-12">
        <h1 class="text-3xl font-bold mb-8">Notes</h1>
        <div v-if="publicNotes.length" class="space-y-4">
          <RouterLink v-for="n in publicNotes" :key="n.id" :to="`/notes/${n.id}`" class="block group">
            <article class="rounded-lg border border-(--border) p-5 hover:border-(--accent) transition">
              <h2 class="text-xl font-semibold group-hover:text-(--accent)">{{ n.title }}</h2>
              <p v-if="n.date" class="text-sm text-(--fg-muted) mt-1">{{ n.date }}</p>
              <div v-if="n.tags.length" class="flex gap-1.5 mt-3">
                <span v-for="t in n.tags" :key="t" class="text-xs bg-(--bg-elevated) px-1.5 py-0.5 rounded">{{ t }}</span>
              </div>
            </article>
          </RouterLink>
        </div>
        <p v-else-if="!loading" class="text-(--fg-muted)">No public notes yet.</p>
      </div>
    </div>
  </div>
</template>
