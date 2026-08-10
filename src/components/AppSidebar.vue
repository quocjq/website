<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from './AppButton.vue'
import AppInput from './AppInput.vue'
import AppModal from './AppModal.vue'
import { useAuth } from '../composables/useAuth'
import { useNotes } from '../composables/useNotes'
import { currentNoteId } from '../composables/store'

const router = useRouter()
const { authed, login, logout } = useAuth()
const { notes, refresh } = useNotes()

const collapsed = ref(false)
const loginOpen = ref(false)
const password = ref('')
const loginError = ref('')
const loginLoading = ref(false)
const passwordInput = ref<HTMLInputElement | null>(null)

const apps = [
  { label: 'Forgejo', href: 'https://git.lunixose.duckdns.org/', icon: 'git-branch' },
  { label: 'Pi-hole', href: 'https://dns.lunixose.duckdns.org/', icon: 'shield' },
  { label: 'Email', href: 'https://lunixose.duckdns.org/email/', icon: 'mail' },
  { label: 'Syncthing', href: 'https://lunixose.duckdns.org/syncthing/', icon: 'refresh' }
]

const folders = computed(() => Array.from(new Set(notes.value.map((n) => n.folder).filter(Boolean))))

onMounted(async () => {
  collapsed.value = localStorage.getItem('lunatix-sidebar-collapsed') === 'true'
  await refresh()
})

watch(collapsed, (value) => {
  localStorage.setItem('lunatix-sidebar-collapsed', String(value))
})

watch(authed, async (authedNow) => {
  if (authedNow) await refresh()
})

watch(loginOpen, (open) => {
  if (open) {
    loginError.value = ''
    nextTick(() => passwordInput.value?.focus())
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && loginOpen.value) loginOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function openApp(app: { href: string }) {
  window.open(app.href, '_blank')
}

function openNote(id: string) {
  if (currentNoteId.value !== id) currentNoteId.value = id
  router.push('/notes')
}

async function submitLogin() {
  if (loginLoading.value) return
  loginLoading.value = true
  loginError.value = ''
  try {
    const ok = await login(password.value)
    if (ok) {
      loginOpen.value = false
      password.value = ''
    }
  } catch (e: any) {
    loginError.value = e?.statusMessage || e?.data?.statusMessage || 'Invalid password'
  } finally {
    loginLoading.value = false
  }
}
</script>

<template>
  <aside
    class="flex h-full shrink-0 flex-col border-r border-(--border) transition-all duration-200"
    :class="collapsed ? 'w-12' : 'w-60'"
  >
    <div class="flex h-14 shrink-0 items-center justify-between gap-1 px-2">
      <span v-if="!collapsed" class="flex items-center gap-1 px-1 font-semibold tracking-tight">
        Lunatix
      </span>
      <AppButton
        variant="ghost"
        :icon="collapsed ? 'panel-left-open' : 'panel-left-close'"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="collapsed = !collapsed"
      />
    </div>

    <div v-if="!collapsed" class="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-2 py-2">
      <nav class="flex flex-col gap-0.5">
        <p class="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-(--fg-muted)">Apps</p>
        <AppButton
          v-for="app in apps"
          :key="app.href"
          variant="ghost"
          :icon="app.icon"
          class="justify-start"
          @click="openApp(app)"
        >
          {{ app.label }}
        </AppButton>
      </nav>

      <div class="flex min-h-0 flex-1 flex-col">
        <p class="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-(--fg-muted)">Notes</p>

        <p v-if="!authed" class="mb-2 px-2 text-xs text-(--fg-muted)">Login to view notes</p>

        <div v-if="authed" class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          <div v-for="folder in ['', ...folders]" :key="folder">
            <p v-if="folder" class="px-2 pt-2 text-[11px] text-(--fg-muted)">{{ folder }}</p>
            <AppButton
              v-for="note in notes.filter(n => n.folder === folder)"
              :key="note.id"
              variant="ghost"
              :icon="'file-text'"
              class="w-full justify-start min-w-0"
              :active="currentNoteId === note.id"
              @click="openNote(note.id)"
            >
              <span class="truncate">{{ note.title }}</span>
              <span v-if="note.public" class="ml-auto text-[10px] text-(--fg-muted)">public</span>
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1 border-t border-(--border) p-2">
      <AppButton
        v-if="!authed"
        icon="log-in"
        class="flex-1 justify-start"
        :aria-label="'Login'"
        @click="loginOpen = true"
      >
        <span v-if="!collapsed">Login</span>
      </AppButton>
      <template v-else>
        <div v-if="!collapsed" class="flex flex-1 items-center gap-1.5 px-1.5 text-xs text-(--fg-muted)">
          <span class="size-1.5 rounded-full bg-(--success)" />
          <span class="truncate">Signed in</span>
        </div>
        <AppButton
          icon="log-out"
          :aria-label="'Logout'"
          variant="ghost"
          @click="logout()"
        />
      </template>
    </div>

    <AppModal :open="loginOpen" title="Sign in" @close="loginOpen = false">
      <p class="mb-4 text-sm text-(--fg-muted)">Enter the admin password to manage documents.</p>
      <form class="flex flex-col gap-3" @submit.prevent="submitLogin">
        <AppInput
          ref="passwordInput"
          v-model="password"
          type="password"
          placeholder="Password"
          :disabled="loginLoading"
          autofocus
        />
        <p v-if="loginError" class="text-sm text-(--danger)">{{ loginError }}</p>
        <AppButton block :loading="loginLoading" type="submit">Sign in</AppButton>
      </form>
    </AppModal>
  </aside>
</template>
