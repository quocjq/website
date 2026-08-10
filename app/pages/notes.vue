<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { VimMode } from 'vim-prosemirror/tiptap'
import 'vim-prosemirror/style.css'
import type { EditorCustomHandlers } from '@nuxt/ui'

const { authed, check } = useAuth()
const { notes, refresh, get, save, create, remove } = useNotes()
const currentNoteId = useState<string | null>('lunatix-current-note', () => null)

// host-based mode: note.* = private editor, lunixose.* = public blog
const isNoteHost = computed(() => {
  if (import.meta.server) {
    const host = useRequestHeaders(['host']).host ?? ''
    return host.startsWith('note.')
  }
  return window.location.hostname.startsWith('note.')
})

const publicNotes = ref<NoteMeta[]>([])

async function loadPublic() {
  const { $csrfFetch } = useNuxtApp()
  const fetcher: any = $csrfFetch || $fetch
  publicNotes.value = await fetcher('/api/public') as NoteMeta[]
}

onMounted(async () => {
  if (isNoteHost.value) {
    await Promise.all([check(), refresh()])
    if (authed.value) {
      const target = notes.value[0]?.id ?? null
      currentNoteId.value = target
    }
  } else {
    await loadPublic()
  }
})

onBeforeUnmount(() => flushSave())
const content = ref<Record<string, any>>({ type: 'doc', content: [{ type: 'paragraph' }] })
const noteTitle = ref('')
const noteTags = ref<string[]>([])
const notePublic = ref(false)
const noteFolder = ref('')
const loaded = ref(false)
const creating = ref(false)

const vimEnabled = ref(false)
const currentEditor = shallowRef<Editor | null>(null)

const { items: emojiItems, extension: Emoji } = useEditorEmojis()
const { items: mentionItems } = useEditorMentions()

const customHandlers = {
  table: {
    canExecute: (editor: Editor) => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    execute: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    isActive: (editor: Editor) => editor.isActive('table'),
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle(customHandlers)
const { toolbarItems, bubbleToolbarItems, getImageToolbarItems, getTableToolbarItems } = useEditorToolbar(customHandlers)

const extensions = computed(() => [
  CodeBlockShiki.configure({
    defaultTheme: 'material-theme',
    themes: {
      light: 'material-theme-lighter',
      dark: 'material-theme-palenight'
    }
  }),
  Emoji,
  TableKit,
  TaskList,
  TaskItem,
  ...(vimEnabled.value ? [VimMode] : [])
])

// --- autosave ---
let saveTimer: ReturnType<typeof setTimeout> | null = null
let pendingSave: { content: Record<string, any>, sourceHash: string } | null = null
let suppressSave = false

function onUpdate(value: Record<string, any>) {
  content.value = value
  if (suppressSave || !loaded.value || !currentNoteId.value) return
  pendingSave = { content: value, sourceHash: currentSourceHash.value }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(flushSave, 1000)
}

const currentSourceHash = ref('')

function flushSave() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null }
  if (!pendingSave || !currentNoteId.value) return
  const snapshot = pendingSave
  pendingSave = null
  save(currentNoteId.value, snapshot.content, snapshot.sourceHash, noteTitle.value)
    .then((res) => {
      currentSourceHash.value = res.rewritten ? '' : currentSourceHash.value
      refresh()
    })
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

async function newNote() {
  if (!authed.value || creating.value) return
  creating.value = true
  try {
    const created = await create('Untitled', noteFolder.value || undefined)
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

function onCreate({ editor }: { editor: Editor }) {
  currentEditor.value = editor
}

function toggleVim() {
  vimEnabled.value = !vimEnabled.value
}
</script>

<template>
  <div class="flex flex-1 min-w-0">
    <template v-if="isNoteHost">
      <!-- notes sidebar -->
    <div class="w-56 shrink-0 border-r border-(--ui-border) overflow-y-auto p-3 space-y-2">
      <div class="flex items-center justify-between px-1">
        <span class="text-xs font-semibold text-(--ui-text-muted) uppercase">Notes</span>
        <UButton v-if="authed" icon="i-lucide-plus" size="xs" variant="ghost" color="neutral" @click="newNote" />
      </div>

      <UInput v-model="noteFolder" placeholder="folder (e.g. journal)" size="xs" :disabled="!authed" />

      <div v-if="authed" class="space-y-0.5">
        <div v-for="folder in ['', ...new Set(notes.map(n => n.folder).filter(Boolean))]" :key="folder" class="space-y-0.5">
          <p v-if="folder" class="px-2 pt-2 text-[11px] text-(--ui-text-muted)">{{ folder }}</p>
          <UButton
            v-for="note in notes.filter(n => n.folder === folder)"
            :key="note.id"
            block
            color="neutral"
            variant="ghost"
            size="sm"
            :active="currentNoteId === note.id"
            class="justify-start px-2 truncate"
            @click="openNote(note.id)"
          >
            {{ note.title }}
            <template #trailing>
              <span v-if="note.public" class="text-[10px] text-(--ui-text-muted)">public</span>
            </template>
          </UButton>
        </div>
      </div>
      <p v-else class="px-2 text-xs text-(--ui-text-muted)">Login to edit notes</p>
    </div>

    <!-- editor -->
    <div class="flex flex-1 flex-col min-w-0">
      <template v-if="currentNoteId && loaded">
        <div class="flex items-center gap-2 px-6 pt-4">
          <UInput
            v-model="noteTitle"
            size="xl"
            variant="ghost"
            placeholder="Note title"
            class="flex-1"
            :disabled="!authed"
          />
          <div v-if="noteTags.length" class="flex gap-1">
            <span v-for="t in noteTags" :key="t" class="text-xs bg-(--ui-bg-elevated) px-1.5 py-0.5 rounded">{{ t }}</span>
          </div>
          <span v-if="notePublic" class="text-xs text-(--ui-text-muted)">public</span>
          <UButton v-if="authed" icon="i-lucide-trash" size="sm" variant="ghost" color="error" @click="deleteNote" />
        </div>

        <UEditor
          :key="vimEnabled ? 'vim-on' : 'vim-off'"
          v-slot="{ editor, handlers }"
          :model-value="content"
          content-type="json"
          :extensions="extensions"
          :handlers="customHandlers"
          :editable="authed"
          autofocus
          placeholder="Write, type '/' for commands..."
          class="flex-1"
          :ui="{
            base: 'p-4 sm:p-14 pt-2',
            content: 'max-w-4xl mx-auto'
          }"
          @update:model-value="onUpdate"
          @create="onCreate"
        >
          <AppHeader>
            <EditorVimStatus :editor="editor" :enabled="vimEnabled" @toggle="toggleVim" />
            <UEditorToolbar :editor="editor" :items="toolbarItems" />
          </AppHeader>

          <UEditorToolbar
            :editor="editor"
            :items="bubbleToolbarItems"
            layout="bubble"
            :should-show="({ editor, view, state }: any) => {
              if (editor.isActive('image') || state.selection instanceof CellSelection) return false
              const { selection } = state
              return view.hasFocus() && !selection.empty
            }"
          >
            <template #link>
              <EditorLinkPopover :editor="editor" />
            </template>
          </UEditorToolbar>

          <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
          <UEditorDragHandle
            v-slot="{ ui, onClick }"
            :editor="editor"
            @node-change="onNodeChange"
          >
            <UButton
              icon="i-lucide-plus"
              color="neutral"
              variant="ghost"
              size="sm"
              :class="ui.handle()"
              @click="(e: MouseEvent) => { e.stopPropagation(); handlers.suggestion?.execute(editor, { pos: onClick()?.pos }).run() }"
            />
            <UDropdownMenu v-slot="{ open }" :modal="false" :items="getDragHandleItems(editor)" :content="{ side: 'left' }">
              <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-grip-vertical" :class="ui.handle()" />
            </UDropdownMenu>
          </UEditorDragHandle>
        </UEditor>
      </template>

      <div v-else class="flex-1 flex items-center justify-center text-(--ui-text-muted)">
        {{ authed ? 'Select or create a note' : 'Login required to view notes' }}
      </div>
    </div>
    </template>

    <!-- public blog (lunixose.*/notes) -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto px-6 py-12">
        <h1 class="text-3xl font-bold mb-8">Notes</h1>
        <div v-if="publicNotes.length" class="space-y-4">
          <NuxtLink
            v-for="note in publicNotes"
            :key="note.id"
            :to="`/notes/${note.id}`"
            class="block group"
          >
            <article class="rounded-lg border border-(--ui-border) p-5 hover:border-(--ui-primary) transition">
              <h2 class="text-xl font-semibold group-hover:text-(--ui-primary)">{{ note.title }}</h2>
              <p v-if="note.date" class="text-sm text-(--ui-text-muted) mt-1">{{ note.date }}</p>
              <div v-if="note.tags.length" class="flex gap-1.5 mt-3">
                <span v-for="t in note.tags" :key="t" class="text-xs bg-(--ui-bg-elevated) px-1.5 py-0.5 rounded">{{ t }}</span>
              </div>
            </article>
          </NuxtLink>
        </div>
        <p v-else class="text-(--ui-text-muted)">No public notes yet.</p>
      </div>
    </div>
  </div>
</template>
