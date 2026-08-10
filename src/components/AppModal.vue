<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
withDefaults(defineProps<{ open: boolean, title?: string }>(), { title: '' })
const emit = defineEmits<{ close: [] }>()
function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') emit('close') }
onMounted(() => { window.addEventListener('keydown', onKeydown) })
onBeforeUnmount(() => { window.removeEventListener('keydown', onKeydown) })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-sm rounded-xl border border-(--border) bg-(--bg) p-5 shadow-xl">
        <h3 v-if="title" class="mb-4 text-lg font-semibold">{{ title }}</h3>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
