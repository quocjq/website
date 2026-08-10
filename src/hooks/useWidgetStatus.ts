import { useCallback, useEffect, useState } from 'react'
import type { ServiceStatus, WidgetStatus } from '../lib/types'

export function useWidgetStatus(
  fetcher: () => Promise<ServiceStatus>,
): { status: WidgetStatus; message: string; refresh: () => void } {
  const [status, setStatus] = useState<WidgetStatus>('unknown')
  const [message, setMessage] = useState('Loading…')

  const load = useCallback(async () => {
    setStatus('unknown')
    setMessage('Loading…')
    try {
      const res = await fetcher()
      setStatus(res.status)
      setMessage(res.message)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Request failed')
    }
  }, [fetcher])

  useEffect(() => {
    void load()
  }, [load])

  return { status, message, refresh: load }
}
