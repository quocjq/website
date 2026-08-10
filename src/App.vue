<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import { useAuth } from './composables/useAuth'

const { check } = useAuth()
check()
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-(--bg)">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>
