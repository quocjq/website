import { useParams } from 'react-router-dom'
import Pane from '../components/layout/Pane'
import { useNote } from '../hooks/useNote'

export default function PostView() {
  const { id } = useParams<{ id: string }>()
  const { note, loading, error } = useNote(id ?? '')

  return (
    <Pane title={note?.meta.title ?? 'Note'} className="flex-1">
      {loading && <p className="text-sm text-ctp-subtext0">Loading note…</p>}
      {error && <p className="text-sm text-ctp-red">{error}</p>}
      {!loading && !error && note && (
        <>
          <div className="mb-4 flex items-center gap-3 text-xs text-ctp-subtext0">
            <span>{note.meta.date}</span>
            {note.meta.tags.map((t) => (
              <span key={t} className="rounded bg-ctp-surface0 px-1.5 py-0.5 text-ctp-blue">
                {t}
              </span>
            ))}
          </div>
          <pre className="whitespace-pre-wrap rounded border border-ctp-surface1 bg-ctp-mantle p-4 font-mono text-xs text-ctp-subtext0">
            {note.content}
          </pre>
        </>
      )}
    </Pane>
  )
}
