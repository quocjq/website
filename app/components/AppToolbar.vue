<script setup lang="ts">
import type AppEditor from './AppEditor.vue'

const props = withDefaults(defineProps<{ editor: InstanceType<typeof AppEditor> | null }>(), { editor: null })

const turnIntoItems = computed<any[]>(() => [
  { type: 'label', label: 'Turn into' },
  { label: 'Paragraph', icon: 'type', active: props.editor?.isActiveKind('paragraph'), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'paragraph') },
  { label: 'Heading 1', icon: 'heading', active: props.editor?.isActiveHeading(1), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'heading', { level: 1 }) },
  { label: 'Heading 2', icon: 'heading', active: props.editor?.isActiveHeading(2), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'heading', { level: 2 }) },
  { label: 'Heading 3', icon: 'heading', active: props.editor?.isActiveHeading(3), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'heading', { level: 3 }) },
  { type: 'divider' },
  { label: 'Bullet List', icon: 'list', active: props.editor?.isActiveKind('bulletList'), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'bulletList') },
  { label: 'Ordered List', icon: 'list-ordered', active: props.editor?.isActiveKind('orderedList'), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'orderedList') },
  { label: 'Task List', icon: 'list-check', active: props.editor?.isActiveKind('taskList'), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'taskList') },
  { type: 'divider' },
  { label: 'Blockquote', icon: 'quote', active: props.editor?.isActiveKind('blockquote'), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'blockquote') },
  { label: 'Code Block', icon: 'code', active: props.editor?.isActiveKind('codeBlock'), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'codeBlock') },
  { label: 'Table', icon: 'table', active: props.editor?.isActiveKind('table'), onClick: () => props.editor?.convertBlock(props.editor.activeIndex, 'table') }
])

const marks = [
  { mark: 'bold', icon: 'bold', label: 'Bold' },
  { mark: 'italic', icon: 'italic', label: 'Italic' },
  { mark: 'underline', icon: 'underline', label: 'Underline' },
  { mark: 'strike', icon: 'strikethrough', label: 'Strikethrough' },
  { mark: 'code', icon: 'code', label: 'Code' }
]

const linkOpen = ref(false)
const linkUrl = ref('')

function applyLink() {
  if (linkUrl.value) props.editor?.setLink(linkUrl.value)
  linkOpen.value = false
  linkUrl.value = ''
}
</script>

<template>
  <div class="flex items-center gap-0.5">
    <AppDropdown :items="turnIntoItems" align="start">
      <template #default="{ toggle }">
        <AppButton variant="ghost" icon="type" aria-label="Turn into" @click="toggle" />
      </template>
    </AppDropdown>

    <div class="mx-1 h-5 w-px bg-(--border)" />

    <AppButton
      v-for="m in marks"
      :key="m.mark"
      variant="ghost"
      :icon="m.icon"
      :active="editor?.hasExecMark(m.mark)"
      :aria-label="m.label"
      @click="editor?.toggleMark(m.mark)"
    />

    <div class="mx-1 h-5 w-px bg-(--border)" />

    <AppDropdown :items="[{ label: 'Link', icon: 'link', onClick: () => (linkOpen = true) }]" align="end">
      <template #default="{ toggle }">
        <AppButton variant="ghost" icon="link" aria-label="Link" @click="toggle" />
      </template>
    </AppDropdown>

    <AppModal :open="linkOpen" title="Add link" @close="linkOpen = false">
      <div class="flex flex-col gap-3">
        <AppInput v-model="linkUrl" placeholder="https://…" />
        <AppButton block @click="applyLink">Apply</AppButton>
      </div>
    </AppModal>
  </div>
</template>
