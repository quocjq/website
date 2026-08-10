import { useCallback, useEffect, useState } from 'react'
import type { NoteMeta } from '../lib/types'
import { fetchNotes } from '../lib/api'

export function useNotes(tag?: string) {
  const [notes, setNotes] = useState<NoteMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setNotes(await fetchNotes(tag))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [tag])

  useEffect(() => {
    void reload()
  }, [reload])

  return { notes, loading, error, reload }
}
