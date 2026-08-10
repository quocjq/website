<script setup lang="ts">
const { check } = useAuth()
const { refresh } = useDocs()

onMounted(async () => {
  await Promise.all([check(), refresh()])
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-(--bg)">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <NuxtPage />
    </div>
  </div>
</template>
