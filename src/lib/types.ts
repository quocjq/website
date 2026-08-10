export type WidgetStatus = 'ok' | 'error' | 'unknown'

export interface ServiceStatus {
  status: WidgetStatus
  message: string
}

export interface NoteMeta {
  id: string
  filename: string
  title: string
  tags: string[]
  date: string
  public: boolean
}

export interface NoteContent {
  meta: NoteMeta
  content: string
}
