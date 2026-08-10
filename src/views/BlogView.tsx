import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Pane from '../components/layout/Pane'
import { useNotes } from '../hooks/useNotes'

const PAGE_SIZE = 6

export default function BlogView() {
  const [tag, setTag] = useState<string | undefined>()
  const [page, setPage] = useState(0)
  const { notes, loading, error } = useNotes(tag)

  const tags = useMemo(() => {
    const set = new Set<string>()
    for (const n of notes) for (const t of n.tags) set.add(t)
    return [...set].sort()
  }, [notes])

  const pageCount = Math.max(1, Math.ceil(notes.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageNotes = notes.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const selectTag = (next?: string) => {
    setTag(next)
    setPage(0)
  }

  return (
    <Pane
      title="Blog"
      className="flex-1"
      actions={
        <select
          value={tag ?? ''}
          onChange={(e) => selectTag(e.target.value || undefined)}
          className="rounded border border-ctp-surface1 bg-ctp-mantle px-2 py-1 text-xs text-ctp-subtext0"
        >
          <option value="">all tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      }
    >
      {loading && <p className="text-sm text-ctp-subtext0">Loading notes…</p>}
      {error && <p className="text-sm text-ctp-red">{error}</p>}
      {!loading && !error && pageNotes.length === 0 && (
        <p className="text-sm text-ctp-subtext0">
          No public notes yet — add <code className="text-ctp-blue">#+public: t</code> to an org
          note.
        </p>
      )}
      <ul className="flex flex-col divide-y divide-ctp-surface1">
        {pageNotes.map((n) => (
          <li key={n.id}>
            <Link
              to={`/blog/${n.id}`}
              className="flex items-baseline justify-between gap-3 px-1 py-2.5 hover:bg-ctp-mantle"
            >
              <span className="truncate text-sm text-ctp-text">{n.title}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-ctp-subtext0">
                <span>{n.date}</span>
                {n.tags.map((t) => (
                  <span key={t} className="rounded bg-ctp-surface0 px-1.5 py-0.5 text-ctp-blue">
                    {t}
                  </span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {pageCount > 1 && (
        <nav className="flex items-center justify-between border-t border-ctp-surface1 pt-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="text-ctp-subtext0 hover:text-ctp-text disabled:opacity-40"
          >
            ← Newer
          </button>
          <span className="text-xs text-ctp-overlay1">
            {safePage + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="text-ctp-subtext0 hover:text-ctp-text disabled:opacity-40"
          >
            Older →
          </button>
        </nav>
      )}
    </Pane>
  )
}
