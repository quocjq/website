<script setup lang="ts">
onMounted(() => {
  navigateTo('/notes', { replace: true })
})
</script>

<template>
  <div class="flex-1 flex items-center justify-center text-(--fg-muted)">Redirecting…</div>
</template>
