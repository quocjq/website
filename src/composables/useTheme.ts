import { onMounted, ref } from 'vue'

export const THEMES = [
  { id: 'catppuccin-latte', label: 'Catppuccin Latte' },
  { id: 'catppuccin-frappe', label: 'Catppuccin Frappé' },
  { id: 'catppuccin-macchiato', label: 'Catppuccin Macchiato' },
  { id: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
  { id: 'gruvbox-light', label: 'Gruvbox Light' },
  { id: 'gruvbox-dark', label: 'Gruvbox Dark' },
  { id: 'evergreen-light', label: 'Evergreen Light' },
  { id: 'evergreen-dark', label: 'Evergreen Dark' }
]

const THEME_KEY = 'lunatix-theme'
export const theme = ref<string>('catppuccin-mocha')

export function applyTheme(id: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', id)
  }
}

export function useTheme() {
  function set(id: string) {
    theme.value = id
    applyTheme(id)
    try {
      localStorage.setItem(THEME_KEY, id)
    } catch {
      /* ignore */
    }
  }

  onMounted(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(THEME_KEY)
    } catch {
      /* ignore */
    }
    const id = saved && THEMES.some((t) => t.id === saved) ? saved : 'catppuccin-mocha'
    theme.value = id
    applyTheme(id)
  })

  return { theme, set }
}
