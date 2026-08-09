export interface DocMeta {
  id: string
  title: string
  updatedAt: string
}

export interface StoredDoc extends DocMeta {
  content: Record<string, any>
}

function apiFetch<T>(url: string, options?: any): Promise<T> {
  const { $csrfFetch } = useNuxtApp()
  const fetcher: any = $csrfFetch || $fetch
  return fetcher(url, options) as Promise<T>
}

export function useDocs() {
  const docs = useState<DocMeta[]>('lunatix-docs', () => [])

  async function refresh() {
    docs.value = await apiFetch<DocMeta[]>('/api/docs')
  }

  async function create() {
    return await apiFetch<DocMeta>('/api/docs', { method: 'POST' })
  }

  async function get(id: string) {
    return await apiFetch<StoredDoc>(`/api/docs/${id}`)
  }

  async function save(id: string, content: Record<string, any>) {
    return await apiFetch<StoredDoc>(`/api/docs/${id}`, {
      method: 'PUT',
      body: { content }
    })
  }

  async function remove(id: string) {
    await apiFetch(`/api/docs/${id}`, { method: 'DELETE' })
  }

  return { docs, refresh, create, get, save, remove }
}
