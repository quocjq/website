import { apiFetch } from '../lib/api'
import { authed, authLoading } from './store'

export function useAuth() {
  async function check() {
    try {
      const res = await apiFetch<{ authed: boolean }>('/api/auth')
      authed.value = res.authed
    } catch {
      authed.value = false
    } finally {
      authLoading.value = false
    }
  }

  async function login(password: string) {
    const res = await apiFetch<{ authed: boolean }>('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ password })
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

  return { authed, authLoading, check, login, logout }
}
