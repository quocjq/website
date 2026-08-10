<script setup lang="ts">
const { authed, check } = useAuth()
const { notes, refresh } = useNotes()
const currentNoteId = useState<string | null>('lunatix-current-note', () => null)

const isNoteHost = computed(() => {
  if (import.meta.server) {
    const host = useRequestHeaders(['host']).host ?? ''
    return host.startsWith('note.')
  }
  return window.location.hostname.startsWith('note.')
})

const publicNotes = ref<NoteMeta[]>([])
const note = ref<{ meta: any, html: string } | null>(null)
const notFound = ref(false)

async function fetchNote(id: string) {
  try {
    const { $csrfFetch } = useNuxtApp()
    const fetcher: any = $csrfFetch || $fetch
    note.value = await fetcher(`/api/notes/${id}`)
    notFound.value = false
  } catch {
    note.value = null
    notFound.value = true
  }
}

watch(currentNoteId, (id) => { if (id) fetchNote(id) })

watch(authed, async (authedNow) => {
  if (!authedNow) return
  await refresh()
  if (notes.value[0] && !currentNoteId.value) {
    currentNoteId.value = notes.value[0].id
  }
})

async function loadPublic() {
  const { $csrfFetch } = useNuxtApp()
  const fetcher: any = $csrfFetch || $fetch
  publicNotes.value = await fetcher('/api/public') as NoteMeta[]
}

onMounted(async () => {
  if (isNoteHost.value) {
    await Promise.all([check(), refresh()])
    if (authed.value && notes.value[0] && !currentNoteId.value) {
      currentNoteId.value = notes.value[0].id
    }
  } else {
    await loadPublic()
  }
})

const folders = computed(() => Array.from(new Set(notes.value.map((n) => n.folder).filter(Boolean))))
</script>

<template>
  <div class="flex flex-1 min-w-0">
    <!-- private reader (note.*) -->
    <template v-if="isNoteHost">
      <div class="w-56 shrink-0 border-r border-(--border) overflow-y-auto p-3 space-y-2">
        <span class="px-1 text-xs font-semibold text-(--fg-muted) uppercase">Notes</span>

        <div v-if="authed" class="space-y-0.5">
          <div v-for="folder in ['', ...folders]" :key="folder" class="space-y-0.5">
            <p v-if="folder" class="px-2 pt-2 text-[11px] text-(--fg-muted)">{{ folder }}</p>
            <AppButton
              v-for="n in notes.filter(n => n.folder === folder)"
              :key="n.id"
              variant="ghost"
              class="w-full justify-start px-2"
              :active="currentNoteId === n.id"
              @click="currentNoteId = n.id"
            >
              <span class="truncate">{{ n.title }}</span>
              <span v-if="n.public" class="ml-auto text-[10px] text-(--fg-muted)">public</span>
            </AppButton>
          </div>
        </div>
        <p v-else class="px-2 text-xs text-(--fg-muted)">Login to view notes</p>
      </div>

      <div class="flex flex-1 flex-col min-w-0">
        <AppHeader>
          <template #brand>
            <span class="flex items-center gap-2 font-semibold">
              <span v-if="note" class="truncate">{{ note.meta.title }}</span>
              <span v-else class="text-(--accent)">notes</span>
            </span>
          </template>
        </AppHeader>

        <div class="flex-1 overflow-y-auto p-4 sm:p-10">
          <div v-if="note" class="mx-auto max-w-4xl">
            <div class="note-body" v-html="note.html" />
          </div>
          <div v-else-if="notFound" class="mx-auto max-w-4xl text-(--fg-muted) py-16 text-center">Note not found</div>
          <div v-else class="mx-auto max-w-4xl text-(--fg-muted) py-16 text-center">
            {{ authed ? 'Select a note' : 'Login to view notes' }}
          </div>
        </div>
      </div>
    </template>

    <!-- public blog (lunixose.*/notes) -->
    <div v-else class="flex-1 overflow-y-auto">
      <AppHeader>
        <template #brand>
          <span class="flex items-center gap-1 font-semibold">lunatix <span class="text-(--accent)">notes</span></span>
        </template>
      </AppHeader>
      <div class="max-w-3xl mx-auto px-6 py-12">
        <h1 class="text-3xl font-bold mb-8">Notes</h1>
        <div v-if="publicNotes.length" class="space-y-4">
          <NuxtLink v-for="n in publicNotes" :key="n.id" :to="`/notes/${n.id}`" class="block group">
            <article class="rounded-lg border border-(--border) p-5 hover:border-(--accent) transition">
              <h2 class="text-xl font-semibold group-hover:text-(--accent)">{{ n.title }}</h2>
              <p v-if="n.date" class="text-sm text-(--fg-muted) mt-1">{{ n.date }}</p>
              <div v-if="n.tags.length" class="flex gap-1.5 mt-3">
                <span v-for="t in n.tags" :key="t" class="text-xs bg-(--bg-elevated) px-1.5 py-0.5 rounded">{{ t }}</span>
              </div>
            </article>
          </NuxtLink>
        </div>
        <p v-else class="text-(--fg-muted)">No public notes yet.</p>
      </div>
    </div>
  </div>
</template>
