const THEME_KEY = 'lunatix-theme'

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

function applyTheme(id: string) {
  if (import.meta.client) {
    document.documentElement.setAttribute('data-theme', id)
  }
}

export function useTheme() {
  const theme = useState<string>('lunatix-theme', () => 'catppuccin-mocha')

  function set(id: string) {
    theme.value = id
    applyTheme(id)
    if (import.meta.client) {
      localStorage.setItem(THEME_KEY, id)
    }
  }

  onMounted(() => {
    const saved = localStorage.getItem(THEME_KEY)
    const id = saved && THEMES.some((t) => t.id === saved) ? saved : 'catppuccin-mocha'
    theme.value = id
    applyTheme(id)
  })

  return { theme, set }
}
