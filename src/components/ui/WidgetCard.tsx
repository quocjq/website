import type { ReactNode } from 'react'

export default function WidgetCard({
  title,
  status,
  onRefresh,
  children,
}: {
  title: string
  status?: 'ok' | 'error' | 'unknown'
  onRefresh?: () => void
  children: ReactNode
}) {
  const statusColor =
    status === 'ok'
      ? 'text-ctp-green'
      : status === 'error'
        ? 'text-ctp-red'
        : 'text-ctp-yellow'
  return (
    <div className="flex flex-col border border-ctp-surface1 bg-ctp-base">
      <header className="flex items-center justify-between border-b border-ctp-surface1 bg-ctp-mantle px-3 py-2">
        <h3 className="text-sm font-medium text-ctp-subtext1">{title}</h3>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs text-ctp-subtext0 hover:text-ctp-text"
              title="Refresh"
            >
              ⟳
            </button>
          )}
          <span
            className={`h-2 w-2 rounded-full ${statusColor}`}
            aria-hidden
            title={status ?? 'unknown'}
          />
        </div>
      </header>
      <div className="flex-1 p-3">{children}</div>
    </div>
  )
}
