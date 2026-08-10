<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppButton from './AppButton.vue'
import AppDropdown from './AppDropdown.vue'
import { THEMES, useTheme } from '../composables/useTheme'

const { theme, set } = useTheme()
const themeOpen = ref(false)

const themeItems = computed(() =>
  THEMES.map((t) => ({
    label: t.label,
    icon: 'moon',
    active: theme.value === t.id,
    onClick: () => set(t.id)
  }))
)
</script>

<template>
  <div class="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-(--border) bg-(--bg) px-4 sm:px-8">
    <div class="flex items-center gap-2 font-semibold tracking-tight">
      <slot name="brand">
        <RouterLink to="/" class="flex items-center gap-1">
          lunatix <span class="text-(--accent)">notes</span>
        </RouterLink>
      </slot>
    </div>

    <div class="flex items-center gap-2">
      <slot />
      <div class="mx-1 h-5 w-px bg-(--border)" />
      <AppDropdown :items="themeItems" align="end">
        <template #default="{ toggle }">
          <AppButton variant="ghost" icon="sun" aria-label="Theme" @click="toggle" />
        </template>
      </AppDropdown>
    </div>
  </div>
</template>
