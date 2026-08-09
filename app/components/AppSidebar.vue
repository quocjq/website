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
  href: 'https://lunixose.duckdns.org/forgejo/',
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

onMounted(() => {
  collapsed.value = localStorage.getItem('lunatix-sidebar-collapsed') === 'true'
})

watch(collapsed, (value) => {
  localStorage.setItem('lunatix-sidebar-collapsed', String(value))
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

    <UModal
      v-model:open="loginOpen"
      :ui="{ content: 'sm:max-w-xs' }"
    >
      <div class="flex flex-col gap-4 p-4">
        <div class="text-center">
          <UAvatar
            icon="i-lucide-key-round"
            size="lg"
            class="mx-auto mb-2"
          />
          <h3 class="font-semibold">
            Sign in
          </h3>
          <p class="text-sm text-(--ui-text-muted)">
            Enter the admin password to manage documents.
          </p>
        </div>

        <form
          class="flex flex-col gap-3"
          @submit.prevent="submitLogin"
        >
          <UInput
            v-model="password"
            type="password"
            name="password"
            placeholder="Password"
            autofocus
            autocomplete="current-password"
            :trailing-icon="'i-lucide-lock'"
          />
          <p
            v-if="loginError"
            class="text-sm text-(--ui-error)"
          >
            {{ loginError }}
          </p>
          <UButton
            type="submit"
            block
            :loading="loginLoading"
          >
            Sign in
          </UButton>
        </form>
      </div>
    </UModal>
  </aside>
</template>
