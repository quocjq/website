import WidgetCard from '../components/ui/WidgetCard'
import Pane from '../components/layout/Pane'
import { useWidgetStatus } from '../hooks/useWidgetStatus'
import { fetchServiceStatus } from '../lib/api'

export default function DashboardView() {
  const forgejo = useWidgetStatus(() =>
    fetchServiceStatus('/api/services/forgejo'),
  )
  const syncthing = useWidgetStatus(() =>
    fetchServiceStatus('/api/services/syncthing'),
  )
  const mail = useWidgetStatus(() => fetchServiceStatus('/api/services/mail'))

  return (
    <Pane title="Dashboard" className="flex-1">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <WidgetCard title="Forgejo" status={forgejo.status} onRefresh={forgejo.refresh}>
          <p className="text-sm text-ctp-subtext0">{forgejo.message}</p>
        </WidgetCard>
        <WidgetCard title="Syncthing" status={syncthing.status} onRefresh={syncthing.refresh}>
          <p className="text-sm text-ctp-subtext0">{syncthing.message}</p>
        </WidgetCard>
        <WidgetCard title="Email" status={mail.status}>
          <p className="text-sm text-ctp-subtext0">{mail.message}</p>
        </WidgetCard>
      </div>
    </Pane>
  )
}
