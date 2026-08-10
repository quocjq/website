import { useCallback, useEffect, useState } from 'react'
import type { NoteContent } from '../lib/types'
import { fetchNote } from '../lib/api'

export function useNote(id: string) {
  const [note, setNote] = useState<NoteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) {
      setError('Missing note id')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setNote(await fetchNote(id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  return { note, loading, error, reload: load }
}
