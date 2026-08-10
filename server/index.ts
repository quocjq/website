import { createServer } from 'node:http'
import { join, extname, normalize, dirname } from 'node:path'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import {
  createApp,
  createRouter,
  createError,
  defineEventHandler,
  getRequestURL,
  getRouterParam,
  readBody,
  setHeader,
  toNodeListener
} from 'h3'
import { adminPassword, clearAuthCookie, isAuthed, setAuthCookie } from './utils/auth'
import {
  assertNoteId,
  createNote,
  listNotes,
  listPublicNotes,
  readNote,
  readPublicNote,
  removeNote,
  saveNote
} from './utils/notes'
import { assertDocId, EMPTY_CONTENT, listDocs, readStoredDoc, removeDoc, saveDoc } from './utils/docs'

const PORT = Number(process.env.PORT || 3100)
const PUBLIC_DIR = process.env.PUBLIC_DIR || join(dirname(fileURLToPath(import.meta.url)), 'dist')

const app = createApp()
const router = createRouter()

function requireAuth(event: any) {
  if (!isAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

// --- auth ---
router.get('/api/auth', defineEventHandler((event) => {
  return { authed: isAuthed(event) }
}))

router.post('/api/auth', defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  if (!body?.password || body.password !== adminPassword()) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
  }
  setAuthCookie(event)
  return { authed: true }
}))

router.delete('/api/auth', defineEventHandler((event) => {
  clearAuthCookie(event)
  return { authed: false }
}))

// --- notes (protected) ---
router.get('/api/notes', defineEventHandler(async (event) => {
  requireAuth(event)
  return await listNotes()
}))

router.post('/api/notes', defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody<{ title?: string, folder?: string }>(event)
  return await createNote(body ?? {})
}))

router.get('/api/notes/:id', defineEventHandler(async (event) => {
  requireAuth(event)
  const id = assertNoteId(getRouterParam(event, 'id'))
  try {
    return await readNote(id)
  } catch (error: any) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || 'Note not found' })
  }
}))

router.put('/api/notes/:id', defineEventHandler(async (event) => {
  requireAuth(event)
  const id = assertNoteId(getRouterParam(event, 'id'))
  const body = await readBody<{ org?: string, title?: string }>(event)
  try {
    return await saveNote(id, body ?? {})
  } catch (error: any) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || 'Note not found' })
  }
}))

router.delete('/api/notes/:id', defineEventHandler(async (event) => {
  requireAuth(event)
  const id = assertNoteId(getRouterParam(event, 'id'))
  try {
    await removeNote(id)
    return { ok: true }
  } catch (error: any) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || 'Note not found' })
  }
}))

// --- public (no auth) ---
router.get('/api/public', defineEventHandler(async () => {
  return await listPublicNotes()
}))

router.get('/api/public/:id', defineEventHandler(async (event) => {
  const id = assertNoteId(getRouterParam(event, 'id'))
  const note = await readPublicNote(id)
  if (!note) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
  return note
}))

// --- docs (no auth, legacy welcome doc) ---
router.get('/api/docs', defineEventHandler(async (event) => {
  const docs = await listDocs()
  if (docs.length === 0) {
    const welcomeId = 'welcome'
    const doc = {
      id: welcomeId,
      title: 'Welcome',
      updatedAt: new Date().toISOString(),
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Welcome to Lunatix' }] }
        ]
      }
    }
    await saveDoc(welcomeId, doc.content)
    return [{ id: welcomeId, title: 'Welcome', updatedAt: doc.updatedAt }]
  }
  return docs
}))

router.post('/api/docs', defineEventHandler(async () => {
  const id = randomUUID()
  return saveDoc(id, EMPTY_CONTENT)
}))

router.get('/api/docs/:id', defineEventHandler(async (event) => {
  const id = assertDocId(getRouterParam(event, 'id'))
  try {
    return await readStoredDoc(id)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }
}))

router.put('/api/docs/:id', defineEventHandler(async (event) => {
  const id = assertDocId(getRouterParam(event, 'id'))
  const body = await readBody<{ content?: Record<string, any> }>(event)
  if (!body?.content || typeof body.content !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'content is required' })
  }
  return await saveDoc(id, body.content)
}))

router.delete('/api/docs/:id', defineEventHandler(async (event) => {
  const id = assertDocId(getRouterParam(event, 'id'))
  try {
    await removeDoc(id)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }
  return { ok: true }
}))

// --- static (SPA) ---
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

router.use('/**', defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = decodeURIComponent(url.pathname)
  const root = normalize(PUBLIC_DIR)
  let filePath = normalize(join(root, pathname))
  if (filePath === root || filePath.startsWith(root + '..') || !filePath.startsWith(root)) {
    filePath = join(root, 'index.html')
  }
  try {
    const s = await stat(filePath)
    if (s.isDirectory()) {
      filePath = join(filePath, 'index.html')
    }
  } catch {
    filePath = join(root, 'index.html')
  }
  try {
    const data = await readFile(filePath)
    setHeader(event, 'content-type', MIME[extname(filePath)] || 'application/octet-stream')
    return data
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
}))

app.use(router)

createServer(toNodeListener(app)).listen(PORT, () => {
  console.log(`lunatix website listening on :${PORT}`)
})
