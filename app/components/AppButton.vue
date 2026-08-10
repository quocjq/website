<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'solid' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md'
  active?: boolean
  icon?: string
  loading?: boolean
  block?: boolean
}>(), {
  variant: 'solid',
  size: 'sm',
  active: false,
  loading: false,
  block: false
})
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
    :class="[
      size === 'xs' ? 'h-6 px-1.5 text-xs' : size === 'sm' ? 'h-8 px-2.5 text-sm' : 'h-9 px-3.5 text-sm',
      block ? 'w-full' : '',
      variant === 'solid'
        ? (active ? 'bg-(--accent) text-(--accent-fg)' : 'bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)')
        : variant === 'outline'
          ? (active ? 'bg-(--accent) text-(--accent-fg) border border-(--accent)' : 'border border-(--border) bg-transparent hover:bg-(--bg-elevated)')
          : (active ? 'bg-(--bg-elevated) text-(--fg)' : 'bg-transparent text-(--fg-muted) hover:bg-(--bg-elevated) hover:text-(--fg)')
    ]"
    :disabled="loading"
  >
    <AppIcon v-if="icon && !loading" :name="icon" :size="size === 'xs' ? 14 : 16" />
    <AppIcon v-if="loading" name="loader" :size="size === 'xs' ? 14 : 16" class="animate-spin" />
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>
