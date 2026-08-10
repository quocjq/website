import { apiFetch } from '../lib/api'
import { notes, noteFolders, currentNote, currentNoteId, noteNotFound } from './store'
import type { NoteMeta, StoredNote } from '../types'

export function useNotes() {
  async function refresh() {
    const list = await apiFetch<NoteMeta[]>('/api/notes')
    notes.value = list
    noteFolders.value = Array.from(new Set(list.map((n) => n.folder).filter(Boolean)))
  }

  async function fetchNote(id: string) {
    try {
      currentNote.value = await apiFetch<StoredNote>(`/api/notes/${id}`)
      noteNotFound.value = false
    } catch {
      currentNote.value = null
      noteNotFound.value = true
    }
  }

  function selectNote(id: string) {
    currentNoteId.value = id
    fetchNote(id)
  }

  async function get(id: string) {
    return await apiFetch<StoredNote>(`/api/notes/${id}`)
  }

  return { notes, noteFolders, refresh, get, fetchNote, selectNote }
}
