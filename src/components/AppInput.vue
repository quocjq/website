<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
const props = withDefaults(defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'xl'
  disabled?: boolean
  autofocus?: boolean
}>(), { type: 'text', size: 'md' })
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const input = ref<HTMLInputElement | null>(null)
const { type, modelValue, placeholder, disabled, size } = props
onMounted(() => { if (props.autofocus) nextTick(() => input.value?.focus()) })
defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <input
    ref="input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    class="w-full rounded-md border border-(--border) bg-(--bg) px-3 text-(--fg) outline-none placeholder:text-(--fg-muted) focus:border-(--accent)"
    :class="size === 'xs' ? 'h-6 text-xs' : size === 'sm' ? 'h-8 text-sm' : size === 'xl' ? 'h-12 text-lg' : 'h-9 text-sm'"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
