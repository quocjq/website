import type { ReactNode } from 'react'

export default function Pane({
  title,
  actions,
  children,
  className = '',
}: {
  title?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`flex min-w-0 flex-col border border-ctp-surface1 bg-ctp-base ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-2 border-b border-ctp-surface1 bg-ctp-mantle px-3 py-1.5">
          {title && (
            <h2 className="text-sm font-medium text-ctp-subtext1">{title}</h2>
          )}
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </header>
      )}
      <div className="flex-1 overflow-auto p-3">{children}</div>
    </section>
  )
}
