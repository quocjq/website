import type { ReactNode } from 'react'

export default function WidgetCard({
  title,
  status,
  children,
}: {
  title: string
  status?: 'ok' | 'error' | 'unknown'
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
        <span
          className={`h-2 w-2 rounded-full ${statusColor}`}
          aria-hidden
          title={status ?? 'unknown'}
        />
      </header>
      <div className="flex-1 p-3">{children}</div>
    </div>
  )
}
