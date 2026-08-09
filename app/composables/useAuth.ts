function apiFetch<T>(url: string, options?: any): Promise<T> {
  const { $csrfFetch } = useNuxtApp()
  const fetcher: any = $csrfFetch || $fetch
  return fetcher(url, options) as Promise<T>
}

export function useAuth() {
  const authed = useState<boolean>('lunatix-authed', () => false)
  const loading = useState<boolean>('lunatix-auth-loading', () => true)

  async function check() {
    try {
      const res = await apiFetch<{ authed: boolean }>('/api/auth')
      authed.value = res.authed
    } catch {
      authed.value = false
    } finally {
      loading.value = false
    }
  }

  async function login(password: string) {
    const res = await apiFetch<{ authed: boolean }>('/api/auth', {
      method: 'POST',
      body: { password }
    })
    authed.value = res.authed
    return res.authed
  }

  async function logout() {
    try {
      await apiFetch('/api/auth', { method: 'DELETE' })
    } finally {
      authed.value = false
    }
  }

  return { authed, loading, check, login, logout }
}
