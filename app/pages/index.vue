<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/core'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { VimMode } from 'vim-prosemirror/tiptap'
import 'vim-prosemirror/style.css'

const { authed, check } = useAuth()
const { docs, refresh, get, save } = useDocs()
const currentDocId = useState<string | null>('lunatix-current-doc', () => null)

const emptyContent = { type: 'doc', content: [{ type: 'paragraph' }] }
const content = ref<Record<string, any>>(emptyContent)
const loaded = ref(false)

const vimEnabled = ref(false)
const currentEditor = shallowRef<Editor | null>(null)

const { items: emojiItems, extension: Emoji } = useEditorEmojis()
const { items: mentionItems } = useEditorMentions()

// Custom handlers for the editor
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

// Guests can only edit the shared "welcome" document
const canEdit = computed(() => authed.value || currentDocId.value === 'welcome')

// --- Document loading & autosave ---

let saveTimer: ReturnType<typeof setTimeout> | null = null
let pendingSave: { id: string, content: Record<string, any> } | null = null
let suppressSave = false

function onUpdate(value: Record<string, any>) {
  content.value = value

  if (suppressSave || !loaded.value || !currentDocId.value || !canEdit.value) return

  pendingSave = { id: currentDocId.value, content: value }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(flushSave, 1000)
}

function flushSave() {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  if (!pendingSave) return

  const { id, content: snapshot } = pendingSave
  pendingSave = null

  save(id, snapshot)
    .then(() => refresh())
    .catch((error) => console.error('Autosave failed:', error))
}

async function loadDoc(id: string) {
  suppressSave = true
  try {
    const doc = await get(id)
    content.value = doc.content || emptyContent
  } catch (error) {
    console.error('Failed to load document:', error)
    content.value = emptyContent
  } finally {
    loaded.value = true
    suppressSave = false
  }
}

function openDoc(id: string | null) {
  if (!id) return
  if (currentDocId.value && currentDocId.value !== id) {
    flushSave()
  }
  currentDocId.value = id
}

watch(currentDocId, (id) => {
  if (id) loadDoc(id)
})

onMounted(async () => {
  await Promise.all([check(), refresh()])
  const target = authed.value ? (docs.value[0]?.id ?? 'welcome') : 'welcome'
  currentDocId.value = target
})

onBeforeUnmount(() => {
  flushSave()
})

// --- Vim mode ---

function onCreate({ editor }: { editor: Editor }) {
  currentEditor.value = editor
}

function toggleVim() {
  vimEnabled.value = !vimEnabled.value
}
</script>

<template>
  <UEditor
    v-if="loaded"
    :key="vimEnabled ? 'vim-on' : 'vim-off'"
    v-slot="{ editor, handlers }"
    :model-value="content"
    content-type="json"
    :extensions="extensions"
    :handlers="customHandlers"
    :editable="canEdit"
    autofocus
    placeholder="Write, type '/' for commands..."
    class="flex-1"
    :ui="{
      base: 'p-4 sm:p-14',
      content: 'max-w-4xl mx-auto'
    }"
    @update:model-value="onUpdate"
    @create="onCreate"
  >
    <AppHeader>
      <EditorVimStatus
        :editor="editor"
        :enabled="vimEnabled"
        @toggle="toggleVim"
      />

      <UEditorToolbar
        :editor="editor"
        :items="toolbarItems"
      />
    </AppHeader>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }: any) => {
        if (editor.isActive('image') || state.selection instanceof CellSelection) {
          return false
        }
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="getImageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }: any) => {
        return editor.isActive('image') && view.hasFocus()
      }"
    />

    <UEditorToolbar
      :editor="editor"
      :items="getTableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }: any) => {
        return editor.state.selection instanceof CellSelection && view.hasFocus()
      }"
    />

    <UEditorEmojiMenu
      :editor="editor"
      :items="emojiItems"
    />

    <UEditorMentionMenu
      :editor="editor"
      :items="mentionItems"
    />

    <UEditorSuggestionMenu
      :editor="editor"
      :items="suggestionItems"
    />

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
        @click="(e: MouseEvent) => {
          e.stopPropagation()
          const node = onClick()

          handlers.suggestion?.execute(editor, { pos: node?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="getDragHandleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
