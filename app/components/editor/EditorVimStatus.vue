<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { getVimMode } from 'vim-prosemirror/tiptap'
import type { Mode } from 'vim-prosemirror/tiptap'

const props = defineProps<{
  editor: Editor
  enabled: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()

const mode = ref<Mode>('normal')

function update() {
  mode.value = getVimMode(props.editor)
}

onMounted(() => {
  update()
  props.editor.on('transaction', update)
})

onBeforeUnmount(() => {
  props.editor.off('transaction', update)
})
</script>

<template>
  <div class="flex items-center gap-1.5">
    <div
      v-if="enabled"
      class="flex h-7 items-center rounded-md bg-(--ui-muted) px-2 font-mono text-xs font-semibold"
      :class="mode === 'insert'
        ? 'bg-(--ui-primary)/15 text-(--ui-primary)'
        : 'bg-(--ui-muted) text-(--ui-text-muted)'"
    >
      -- {{ mode.toUpperCase() }} --
    </div>

    <UTooltip :text="enabled ? 'Disable Vim mode' : 'Enable Vim mode'">
      <UButton
        icon="i-lucide-key-round"
        :label="'Vim'"
        color="neutral"
        variant="ghost"
        size="sm"
        :active="enabled"
        @click="emit('toggle')"
      />
    </UTooltip>
  </div>
</template>
