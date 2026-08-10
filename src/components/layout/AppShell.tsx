import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'grid' },
  { to: '/blog', label: 'Blog', icon: 'note' },
  { to: '/projects', label: 'Projects', icon: 'archive' },
] as const

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    document.documentElement.classList.toggle('collapsed-sidebar', collapsed)
  }, [collapsed])

  return (
    <div className="flex h-full">
      <aside
        className={`flex shrink-0 flex-col border-r border-ctp-surface1 bg-ctp-mantle transition-[width] duration-200 ${
          collapsed ? 'w-12' : 'w-56'
        }`}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-9 items-center justify-center border-b border-ctp-surface1 text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-xs font-mono">{collapsed ? '»' : '«'}</span>
        </button>
        <nav className="flex flex-col gap-0.5 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-ctp-surface1 text-ctp-text'
                    : 'text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <span aria-hidden>{icon(item.icon)}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-0.5 border-t border-ctp-surface1 p-2">
          {!collapsed && (
            <span className="px-2 pb-1 text-[11px] uppercase tracking-wider text-ctp-overlay1">
              lunixose
            </span>
          )}
          <button
            onClick={toggle}
            className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <span aria-hidden>{theme === 'mocha' ? '☾' : '☀'}</span>
            {!collapsed && <span>Theme</span>}
          </button>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}

function icon(name: string) {
  const glyphs: Record<string, string> = {
    grid: '▦',
    note: '▤',
    archive: '▥',
  }
  return <span className="font-mono text-sm">{glyphs[name] ?? '•'}</span>
}
