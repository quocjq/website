<script setup lang="ts">
const { authed, check } = useAuth()
const { notes, refresh, get, save, create, remove } = useNotes()
const currentNoteId = useState<string | null>('lunatix-current-note', () => null)

const isNoteHost = computed(() => {
  if (import.meta.server) {
    const host = useRequestHeaders(['host']).host ?? ''
    return host.startsWith('note.')
  }
  return window.location.hostname.startsWith('note.')
})

const publicNotes = ref<NoteMeta[]>([])
const editor = ref<any>(null)

const content = ref<any>({ type: 'doc', content: [{ type: 'paragraph' }] })
const noteTitle = ref('')
const noteTags = ref<string[]>([])
const notePublic = ref(false)
const noteFolder = ref('')
const loaded = ref(false)
const creating = ref(false)

let saveTimer: ReturnType<typeof setTimeout> | null = null
let pendingSave: { content: any, sourceHash: string } | null = null
let suppressSave = false
const currentSourceHash = ref('')

function onUpdate(value: any) {
  content.value = value
  if (suppressSave || !loaded.value || !currentNoteId.value) return
  pendingSave = { content: value, sourceHash: currentSourceHash.value }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(flushSave, 1000)
}

function flushSave() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null }
  if (!pendingSave || !currentNoteId.value) return
  const snapshot = pendingSave
  pendingSave = null
  save(currentNoteId.value, snapshot.content, snapshot.sourceHash, noteTitle.value)
    .then(() => refresh())
    .catch((error) => console.error('Autosave failed:', error))
}

async function loadNote(id: string) {
  suppressSave = true
  try {
    const note = await get(id)
    content.value = note.content || { type: 'doc', content: [{ type: 'paragraph' }] }
    currentSourceHash.value = note.sourceHash
    noteTitle.value = note.meta?.title ?? id
    noteTags.value = note.meta?.tags ?? []
    notePublic.value = !!note.meta?.public
    noteFolder.value = (notes.value.find((n) => n.id === id)?.folder) ?? ''
  } catch (error) {
    console.error('Failed to load note:', error)
  } finally {
    loaded.value = true
    suppressSave = false
  }
}

function openNote(id: string) {
  if (!id) return
  if (currentNoteId.value && currentNoteId.value !== id) flushSave()
  currentNoteId.value = id
}

watch(currentNoteId, (id) => { if (id) loadNote(id) })

async function loadPublic() {
  const { $csrfFetch } = useNuxtApp()
  const fetcher: any = $csrfFetch || $fetch
  publicNotes.value = await fetcher('/api/public') as NoteMeta[]
}

onMounted(async () => {
  if (isNoteHost.value) {
    await Promise.all([check(), refresh()])
    if (authed.value) {
      currentNoteId.value = notes.value[0]?.id ?? null
    }
  } else {
    await loadPublic()
  }
})

onBeforeUnmount(() => flushSave())

async function newNote() {
  if (!authed.value || creating.value) return
  creating.value = true
  try {
    const created = await create('Untitled', noteFolder.value || undefined)
    loaded.value = false
    currentNoteId.value = created.id
  } finally {
    creating.value = false
  }
}

async function deleteNote() {
  if (!authed.value || !currentNoteId.value) return
  await remove(currentNoteId.value)
  currentNoteId.value = null
  content.value = { type: 'doc', content: [{ type: 'paragraph' }] }
  loaded.value = false
}

const folders = computed(() => Array.from(new Set(notes.value.map((n) => n.folder).filter(Boolean))))
</script>

<template>
  <div class="flex flex-1 min-w-0">
    <!-- private editor (note.*) -->
    <template v-if="isNoteHost">
      <div class="w-56 shrink-0 border-r border-(--border) overflow-y-auto p-3 space-y-2">
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-semibold text-(--fg-muted) uppercase">Notes</span>
          <AppButton v-if="authed" icon="plus" size="xs" variant="ghost" aria-label="New note" @click="newNote" />
        </div>

        <AppInput v-model="noteFolder" placeholder="folder (e.g. journal)" size="sm" :disabled="!authed" />

        <div v-if="authed" class="space-y-0.5">
          <div v-for="folder in ['', ...folders]" :key="folder" class="space-y-0.5">
            <p v-if="folder" class="px-2 pt-2 text-[11px] text-(--fg-muted)">{{ folder }}</p>
            <AppButton
              v-for="note in notes.filter(n => n.folder === folder)"
              :key="note.id"
              variant="ghost"
              class="w-full justify-start px-2"
              :active="currentNoteId === note.id"
              @click="openNote(note.id)"
            >
              <span class="truncate">{{ note.title }}</span>
              <span v-if="note.public" class="ml-auto text-[10px] text-(--fg-muted)">public</span>
            </AppButton>
          </div>
        </div>
        <p v-else class="px-2 text-xs text-(--fg-muted)">Login to edit notes</p>
      </div>

      <div class="flex flex-1 flex-col min-w-0">
        <template v-if="currentNoteId && loaded">
          <AppHeader>
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <AppInput v-model="noteTitle" size="md" placeholder="Note title" :disabled="!authed" class="max-w-sm" />
              <div v-if="noteTags.length" class="flex gap-1">
                <span v-for="t in noteTags" :key="t" class="text-xs bg-(--bg-elevated) px-1.5 py-0.5 rounded">{{ t }}</span>
              </div>
              <span v-if="notePublic" class="text-xs text-(--fg-muted)">public</span>
              <AppButton v-if="authed" icon="trash" variant="ghost" size="sm" aria-label="Delete note" @click="deleteNote" />
            </div>
            <AppToolbar :editor="editor" />
          </AppHeader>

          <div class="flex-1 overflow-y-auto p-4 sm:p-10">
            <div class="mx-auto max-w-4xl">
              <AppEditor
                ref="editor"
                :model-value="content"
                :editable="authed"
                placeholder="Write, type to begin…"
                @update:model-value="onUpdate"
              />
            </div>
          </div>
        </template>

        <div v-else class="flex-1 flex items-center justify-center text-(--fg-muted)">
          {{ authed ? 'Select or create a note' : 'Login required to view notes' }}
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
          <NuxtLink v-for="note in publicNotes" :key="note.id" :to="`/notes/${note.id}`" class="block group">
            <article class="rounded-lg border border-(--border) p-5 hover:border-(--accent) transition">
              <h2 class="text-xl font-semibold group-hover:text-(--accent)">{{ note.title }}</h2>
              <p v-if="note.date" class="text-sm text-(--fg-muted) mt-1">{{ note.date }}</p>
              <div v-if="note.tags.length" class="flex gap-1.5 mt-3">
                <span v-for="t in note.tags" :key="t" class="text-xs bg-(--bg-elevated) px-1.5 py-0.5 rounded">{{ t }}</span>
              </div>
            </article>
          </NuxtLink>
        </div>
        <p v-else class="text-(--fg-muted)">No public notes yet.</p>
      </div>
    </div>
  </div>
</template>
