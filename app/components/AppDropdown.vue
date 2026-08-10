<script setup lang="ts">
const props = withDefaults(defineProps<{
  items: Array<{ label?: string, type?: 'label' | 'divider', icon?: string, active?: boolean, onClick?: () => void, href?: string } | string>
  align?: 'start' | 'end'
}>(), { align: 'start' })
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

function itemOf(x: any) { return typeof x === 'string' ? { label: x } : x }

function select(item: any) {
  open.value = false
  item.onClick?.()
}
</script>

<template>
  <div ref="root" class="relative inline-block">
    <slot :open="open" :toggle="() => (open = !open)" />
    <div
      v-if="open"
      class="absolute z-50 mt-1 min-w-44 rounded-md border border-(--border) bg-(--bg) py-1 shadow-lg"
      :class="align === 'end' ? 'right-0' : 'left-0'"
      @click.stop
    >
      <template v-for="(it, i) in items" :key="i">
        <div v-if="itemOf(it).type === 'divider'" class="my-1 h-px bg-(--border)" />
        <div
          v-else-if="itemOf(it).type === 'label'"
          class="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-(--fg-muted)"
        >
          {{ itemOf(it).label }}
        </div>
        <a
          v-else-if="itemOf(it).href"
          :href="itemOf(it).href"
          class="flex items-center gap-2 px-2.5 py-1.5 text-sm text-(--fg) hover:bg-(--bg-elevated)"
        >
          <AppIcon v-if="itemOf(it).icon" :name="itemOf(it).icon" :size="14" />
          <span>{{ itemOf(it).label }}</span>
        </a>
        <button
          v-else
          type="button"
          class="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm hover:bg-(--bg-elevated)"
          :class="itemOf(it).active ? 'text-(--accent)' : 'text-(--fg)'"
          @click="select(itemOf(it))"
        >
          <AppIcon v-if="itemOf(it).icon" :name="itemOf(it).icon" :size="14" />
          <span>{{ itemOf(it).label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>
