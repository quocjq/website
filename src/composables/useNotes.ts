import { apiFetch } from '../lib/api'
import { notes, noteFolders } from './store'
import type { NoteMeta, StoredNote } from '../types'

export function useNotes() {
  async function refresh() {
    const list = await apiFetch<NoteMeta[]>('/api/notes')
    notes.value = list
    noteFolders.value = Array.from(new Set(list.map((n) => n.folder).filter(Boolean)))
  }

  async function get(id: string) {
    return await apiFetch<StoredNote>(`/api/notes/${id}`)
  }

  return { notes, noteFolders, refresh, get }
}
