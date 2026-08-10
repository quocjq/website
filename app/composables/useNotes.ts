function apiFetch<T>(url: string, options?: any): Promise<T> {
  const { $csrfFetch } = useNuxtApp()
  const fetcher: any = $csrfFetch || $fetch
  return fetcher(url, options) as Promise<T>
}

export interface NoteMeta {
  id: string
  filename: string
  relPath: string
  folder: string
  title: string
  date: string
  tags: string[]
  public: boolean
  updatedAt: number
}

export interface StoredNote {
  id: string
  meta: any
  sourceHash: string
  content: Record<string, any>
}

export function useNotes() {
  const notes = useState<NoteMeta[]>('lunatix-notes', () => [])
  const folders = useState<string[]>('lunatix-note-folders', () => [])

  async function refresh() {
    const list = await apiFetch<NoteMeta[]>('/api/notes')
    notes.value = list
    folders.value = Array.from(new Set(list.map((n) => n.folder).filter(Boolean)))
  }

  async function get(id: string) {
    return await apiFetch<StoredNote>(`/api/notes/${id}`)
  }

  async function save(id: string, content: Record<string, any>, sourceHash?: string, title?: string) {
    return await apiFetch<any>(`/api/notes/${id}`, {
      method: 'PUT',
      body: { content, sourceHash, title }
    })
  }

  async function create(title?: string, folder?: string) {
    const created = await apiFetch<any>('/api/notes', {
      method: 'POST',
      body: { title, folder }
    })
    await refresh()
    return created
  }

  async function remove(id: string) {
    await apiFetch(`/api/notes/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return { notes, folders, refresh, get, save, create, remove }
}

export function titleToPath(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
