import { useCallback, useEffect, useState } from 'react'

export type Theme = 'mocha'

const KEY = 'lunixose-theme'

export function useTheme() {
  const [theme] = useState<Theme>('mocha')

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored === 'latte' || stored === 'frappe' || stored === 'macchiato') {
      document.documentElement.dataset.ctp = stored
    } else {
      document.documentElement.dataset.ctp = 'mocha'
    }
  }, [theme])

  const toggle = useCallback(() => {
    const current = document.documentElement.dataset.ctp ?? 'mocha'
    const next = current === 'mocha' ? 'latte' : 'mocha'
    document.documentElement.dataset.ctp = next
    localStorage.setItem(KEY, next)
  }, [])

  return { theme, toggle }
}
