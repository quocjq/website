import { useParams, Link } from 'react-router-dom'
import { useNote } from '../hooks/useNote'
import { useOrgToHtml } from '../hooks/useOrgToHtml'

export default function PostView() {
  const { id } = useParams<{ id: string }>()
  const { note, loading, error } = useNote(id ?? '')
  const { html, toc, readingTime } = useOrgToHtml(note?.content ?? '')

  return (
    <div className="flex min-w-0 flex-1">
      <article className="min-w-0 flex-1 overflow-auto border-r border-ctp-surface1">
        <header className="border-b border-ctp-surface1 bg-ctp-mantle px-6 py-4">
          <p className="mb-1 text-xs text-ctp-overlay1">
            <Link to="/blog" className="hover:text-ctp-text">
              ← Blog
            </Link>
          </p>
          <h1 className="text-2xl font-semibold text-ctp-text">{note?.meta.title}</h1>
          {note && (
            <div className="mt-2 flex items-center gap-3 text-xs text-ctp-subtext0">
              <span>{note.meta.date}</span>
              <span aria-hidden>·</span>
              <span>{readingTime} min read</span>
              {note.meta.tags.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span className="flex gap-1">
                    {note.meta.tags.map((t) => (
                      <span key={t} className="rounded bg-ctp-surface0 px-1.5 py-0.5 text-ctp-blue">
                        {t}
                      </span>
                    ))}
                  </span>
                </>
              )}
            </div>
          )}
        </header>
        {loading && <p className="p-6 text-sm text-ctp-subtext0">Loading note…</p>}
        {error && <p className="p-6 text-sm text-ctp-red">{error}</p>}
        {!loading && !error && note && (
          <div
            className="org-content px-6 py-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </article>
      {toc.length > 1 && (
        <nav className="hidden w-52 shrink-0 overflow-auto p-4 lg:block" aria-label="Table of contents">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-ctp-overlay1">On this page</p>
          <ul className="flex flex-col gap-0.5">
            {toc.map((entry) => (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  className="block text-sm text-ctp-subtext0 hover:text-ctp-text"
                  style={{ paddingLeft: `${(entry.level - 1) * 12}px` }}
                >
                  {entry.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
