<script setup lang="ts">
const { authed, login, logout } = useAuth()
const { docs, refresh, create, remove } = useDocs()
const currentDocId = useState<string | null>('lunatix-current-doc', () => null)

const collapsed = ref(false)
const loginOpen = ref(false)
const password = ref('')
const loginError = ref('')
const loginLoading = ref(false)
const creating = ref(false)
const passwordInput = ref<HTMLInputElement | null>(null)

const apps = [
  { label: 'Forgejo', href: 'https://git.lunixose.duckdns.org/', icon: 'git-branch' },
  { label: 'Pi-hole', href: 'https://dns.lunixose.duckdns.org/', icon: 'shield' },
  { label: 'Email', href: 'https://lunixose.duckdns.org/email/', icon: 'mail' },
  { label: 'Syncthing', href: 'https://lunixose.duckdns.org/syncthing/', icon: 'refresh' },
  { label: 'Notes', href: '/notes', icon: 'file-text' }
]

onMounted(() => {
  collapsed.value = localStorage.getItem('lunatix-sidebar-collapsed') === 'true'
})

watch(collapsed, (value) => {
  localStorage.setItem('lunatix-sidebar-collapsed', String(value))
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

function openApp(app: { href: string }) {
  if (app.href.startsWith('http')) window.open(app.href, '_blank')
  else navigateTo(app.href)
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

async function openDoc(id: string) {
  if (currentDocId.value === id) return
  currentDocId.value = id
}

async function newDoc() {
  if (!authed.value || creating.value) return
  creating.value = true
  try {
    const doc = await create()
    await refresh()
    currentDocId.value = doc.id
  } finally {
    creating.value = false
  }
}

async function deleteDoc(id: string) {
  if (!authed.value) return
  await remove(id)
  await refresh()
  if (currentDocId.value === id) {
    currentDocId.value = docs.value[0]?.id || null
  }
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
    loginError.value = e?.data?.statusMessage || 'Invalid password'
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
        lunatix <span class="text-(--accent)">docs</span>
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
        <div class="flex items-center justify-between px-2 pb-1.5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-(--fg-muted)">Documents</p>
          <AppButton
            v-if="authed"
            icon="plus"
            size="xs"
            variant="ghost"
            :loading="creating"
            :aria-label="'New document'"
            @click="newDoc"
          />
        </div>

        <p v-if="!authed" class="mb-2 px-2 text-xs text-(--fg-muted)">Read-only shared documents.</p>

        <ul class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          <li v-for="doc in docs" :key="doc.id" class="group flex items-center">
            <AppButton
              variant="ghost"
              :icon="'file-text'"
              class="flex-1 justify-start min-w-0"
              :active="currentDocId === doc.id"
              @click="openDoc(doc.id)"
            >
              <span class="truncate">{{ doc.title || 'Untitled' }}</span>
            </AppButton>
            <AppButton
              v-if="authed"
              icon="trash"
              variant="ghost"
              size="xs"
              class="mr-1 hidden group-hover:flex"
              :aria-label="`Delete ${doc.title || 'Untitled'}`"
              @click="deleteDoc(doc.id)"
            />
          </li>
        </ul>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1 border-t border-(--border) p-2">
      <AppButton
        v-if="!authed"
        icon="log-in"
        :label="collapsed ? undefined : undefined"
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
