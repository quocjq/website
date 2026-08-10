import type { App } from 'h3'
import { createRouter, defineEventHandler, getQuery, getRouterParam, send } from 'h3'
import { getNoteById, listNotes, fileLastModified } from './notes'

export function defineNotesRoutes(app: App) {
  const router = createRouter()

  router.get(
    '/api/notes',
    defineEventHandler(async (event) => {
      const { tag } = getQuery(event)
      let notes = (await listNotes()).filter((n) => n.public)
      notes.sort((a, b) => b.date.localeCompare(a.date))
      if (typeof tag === 'string' && tag.length > 0) {
        notes = notes.filter((n) => n.tags.includes(tag))
      }
      return notes
    }),
  )

  router.get(
    '/api/notes/:id',
    defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')
      if (!id) return null
      const note = await getNoteById(id)
      if (!note || !note.meta.public) {
        throw create404()
      }
      return note
    }),
  )

  router.get(
    '/rss.xml',
    defineEventHandler(async (event) => {
      const notes = (await listNotes())
        .filter((n) => n.public)
        .sort((a, b) => b.date.localeCompare(a.date))
      const base = 'https://lunixose.duckdns.org'
      const items: string[] = []
      for (const n of notes) {
        const url = `${base}/blog/${n.id}`
        const mtime = await fileLastModified(n.id)
        items.push(`    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(mtime).toUTCString()}</pubDate>
    </item>`)
      }
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>lunixose</title>
    <link>${base}</link>
    <description>lunixose blog</description>
    ${items.join('\n')}
  </channel>
</rss>
`
      event.node.res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
      return send(event, xml)
    }),
  )

  app.use(router)
}

function create404() {
  const error = new Error('not found')
  ;(error as Error & { statusCode?: number }).statusCode = 404
  return error
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
