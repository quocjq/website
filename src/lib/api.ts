export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const err: any = new Error(res.statusText || 'Request failed')
    try {
      const body = await res.json()
      err.data = body
      err.statusMessage = body?.statusMessage || res.statusText
    } catch {
      err.data = undefined
    }
    throw err
  }
  return res.json() as Promise<T>
}
