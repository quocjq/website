<script setup lang="ts">
const { authed, check } = useAuth()
const { docs, refresh, get, save } = useDocs()
const currentDocId = useState<string | null>('lunatix-current-doc', () => null)

const content = ref<any>({ type: 'doc', content: [{ type: 'paragraph' }] })
const loaded = ref(false)
const editor = ref<any>(null)

const canEdit = computed(() => authed.value || currentDocId.value === 'welcome')

let saveTimer: ReturnType<typeof setTimeout> | null = null
let pendingSave: any = null
let suppressSave = false

function onUpdate(value: any) {
  content.value = value
  if (suppressSave || !loaded.value || !currentDocId.value || !canEdit.value) return
  pendingSave = { id: currentDocId.value, content: value }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(flushSave, 1000)
}

function flushSave() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null }
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
    content.value = doc.content || { type: 'doc', content: [{ type: 'paragraph' }] }
  } catch (error) {
    console.error('Failed to load document:', error)
    content.value = { type: 'doc', content: [{ type: 'paragraph' }] }
  } finally {
    loaded.value = true
    suppressSave = false
  }
}

function openDoc(id: string | null) {
  if (!id) return
  if (currentDocId.value && currentDocId.value !== id) flushSave()
  currentDocId.value = id
}

watch(currentDocId, (id) => { if (id) loadDoc(id) })

onMounted(async () => {
  await Promise.all([check(), refresh()])
  const target = authed.value ? (docs.value[0]?.id ?? 'welcome') : 'welcome'
  currentDocId.value = target
})

onBeforeUnmount(() => flushSave())
</script>

<template>
  <div v-if="loaded" class="flex flex-1 flex-col">
    <AppHeader>
      <AppToolbar :editor="editor" />
    </AppHeader>

    <div class="flex-1 overflow-y-auto p-4 sm:p-10">
      <div class="mx-auto max-w-4xl">
        <AppEditor
          ref="editor"
          :model-value="content"
          :editable="canEdit"
          placeholder="Write, type to begin…"
          @update:model-value="onUpdate"
        />
      </div>
    </div>
  </div>
</template>
