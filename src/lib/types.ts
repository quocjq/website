export type WidgetStatus = 'ok' | 'error' | 'unknown'

export interface ServiceStatus {
  status: WidgetStatus
  message: string
}
