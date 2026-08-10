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

const apps = [{
  label: 'Forgejo',
  href: 'https://git.lunixose.duckdns.org/',
  icon: 'i-lucide-git-branch'
}, {
  label: 'Pi-hole',
  href: 'https://dns.lunixose.duckdns.org/',
  icon: 'i-lucide-shield'
}, {
  label: 'Email',
  href: 'https://lunixose.duckdns.org/email/',
  icon: 'i-lucide-mail'
}, {
  label: 'Syncthing',
  href: 'https://lunixose.duckdns.org/syncthing/',
  icon: 'i-lucide-refresh-cw'
}]

watch(collapsed, (value) => {
  localStorage.setItem('lunatix-sidebar-collapsed', String(value))
})

const passwordInput = ref<HTMLInputElement | null>(null)

watch(loginOpen, (open) => {
  if (open) {
    loginError.value = ''
    nextTick(() => passwordInput.value?.focus())
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && loginOpen.value) {
    loginOpen.value = false
  }
}

onMounted(() => {
  collapsed.value = localStorage.getItem('lunatix-sidebar-collapsed') === 'true'
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

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
    const fallback = docs.value.find(d => d.id === 'welcome') || docs.value[0]
    currentDocId.value = fallback?.id || null
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
    class="flex h-full shrink-0 flex-col border-e border-(--ui-border) bg-(--ui-bg-muted)/40 transition-all duration-200"
    :class="collapsed ? 'w-12' : 'w-60'"
  >
    <div class="flex h-12 shrink-0 items-center justify-between gap-1 px-2">
      <span
        v-if="!collapsed"
        class="flex items-center gap-1 px-1 font-semibold tracking-tight"
      >
        lunatix <span class="text-(--ui-primary)">docs</span>
      </span>
      <UButton
        :icon="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
        color="neutral"
        variant="ghost"
        size="sm"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="collapsed = !collapsed"
      />
    </div>

    <div
      v-if="!collapsed"
      class="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-2 py-2"
    >
      <nav class="flex flex-col gap-0.5">
        <p class="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-(--ui-text-muted)">
          Apps
        </p>
        <UButton
          v-for="app in apps"
          :key="app.href"
          :icon="app.icon"
          :label="app.label"
          :to="app.href"
          target="_blank"
          color="neutral"
          variant="ghost"
          size="sm"
          class="justify-start"
          :ui="{ label: 'truncate' }"
        />
      </nav>

      <div class="flex min-h-0 flex-1 flex-col">
        <div class="flex items-center justify-between px-2 pb-1.5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-(--ui-text-muted)">
            Documents
          </p>
          <UButton
            v-if="authed"
            icon="i-lucide-plus"
            size="xs"
            color="neutral"
            variant="ghost"
            :loading="creating"
            aria-label="New document"
            @click="newDoc"
          />
        </div>

        <p
          v-if="!authed"
          class="mb-2 px-2 text-xs text-(--ui-text-muted)"
        >
          Read-only shared documents.
        </p>

        <ul class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          <li
            v-for="doc in docs"
            :key="doc.id"
            class="group flex items-center"
          >
            <UButton
              :icon="'i-lucide-file-text'"
              :label="doc.title || 'Untitled'"
              color="neutral"
              variant="ghost"
              size="sm"
              :active="currentDocId === doc.id"
              class="justify-start flex-1 min-w-0"
              :ui="{ label: 'truncate' }"
              @click="openDoc(doc.id)"
            />
            <UButton
              v-if="authed"
              icon="i-lucide-trash"
              color="neutral"
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

    <div class="flex shrink-0 items-center gap-1 border-t border-(--ui-border) p-2">
      <UButton
        v-if="!authed"
        icon="i-lucide-log-in"
        :label="collapsed ? undefined : 'Login'"
        :aria-label="'Login'"
        color="neutral"
        variant="ghost"
        size="sm"
        class="flex-1 justify-start"
        @click="loginOpen = true"
      />
      <template v-else>
        <div
          v-if="!collapsed"
          class="flex flex-1 items-center gap-1.5 px-1.5 text-xs text-(--ui-text-muted)"
        >
          <span class="size-1.5 rounded-full bg-(--ui-success)" />
          <span class="truncate">Signed in</span>
        </div>
        <UButton
          icon="i-lucide-log-out"
          :aria-label="'Logout'"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="logout()"
        />
      </template>
    </div>

    <Teleport to="body">
      <div
        v-if="loginOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="loginOpen = false"
      >
        <div class="w-[320px] rounded-xl border border-(--ui-border) bg-(--ui-bg) p-5 shadow-xl">
          <div class="mb-4 text-center">
            <h3 class="text-lg font-semibold">
              Sign in
            </h3>
            <p class="mt-1 text-sm text-(--ui-text-muted)">
              Enter the admin password to manage documents.
            </p>
          </div>

          <form
            class="flex flex-col gap-3"
            @submit.prevent="submitLogin"
          >
            <input
              ref="passwordInput"
              v-model="password"
              type="password"
              name="password"
              placeholder="Password"
              autocomplete="current-password"
              class="w-full rounded-md border border-(--ui-border) bg-(--ui-bg-elevated) px-3 py-2 text-sm outline-none focus:border-(--ui-primary)"
              :disabled="loginLoading"
            />
            <p
              v-if="loginError"
              class="text-sm text-(--ui-error)"
            >
              {{ loginError }}
            </p>
            <button
              type="submit"
              class="w-full rounded-md bg-(--ui-primary) px-3 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
              :disabled="loginLoading"
            >
              {{ loginLoading ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>
  </aside>
</template>
