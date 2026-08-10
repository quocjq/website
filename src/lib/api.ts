import type { NoteContent, NoteMeta, ServiceStatus } from './types'

async function json<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`GET ${path} → ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function fetchServiceStatus(path: string): Promise<ServiceStatus> {
  return json<ServiceStatus>(path)
}

export function fetchNotes(tag?: string): Promise<NoteMeta[]> {
  const q = tag ? `?tag=${encodeURIComponent(tag)}` : ''
  return json<NoteMeta[]>(`/api/notes${q}`)
}

export function fetchNote(id: string): Promise<NoteContent> {
  return json<NoteContent>(`/api/notes/${encodeURIComponent(id)}`)
}
