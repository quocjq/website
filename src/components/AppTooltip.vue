<script setup lang="ts">
withDefaults(defineProps<{ text: string }>(), { text: '' })
</script>

<template>
  <span class="group relative inline-flex" tabindex="0">
    <slot />
    <span
      class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-(--fg) px-2 py-1 text-xs text-(--bg) opacity-0 shadow transition-opacity group-hover:opacity-100"
    >
      {{ text }}
    </span>
  </span>
</template>
