import { readdir, readFile, writeFile, rename, unlink, mkdir, stat } from 'node:fs/promises'
import { join, relative, dirname, basename } from 'node:path'
import { createError } from 'h3'
import { orgToJson, jsonToOrg, hashNote } from './org'

export interface NoteMeta {
  id: string
  filename: string
  relPath: string
  folder: string
  title: string
  date: string
  tags: string[]
  public: boolean
  updatedAt: number
}

const DENOTE_RE = /^(\d{8}T\d{6})--([^__]+?)(?:__(.+))?$/

export function getNotesDir() {
  return process.env.NOTES_DIR || '/root/Notes'
}

function parseDenoteName(filename: string): { identifier: string, title: string, tags: string[] } | null {
  const base = basename(filename, '.org')
  const m = DENOTE_RE.exec(base)
  if (!m) return null
  return {
    identifier: m[1],
    title: m[2].replace(/-/g, ' '),
    tags: m[3] ? m[3].split('_').filter(Boolean) : []
  }
}

async function listFiles(dir: string): Promise<string[]> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  const out: string[] = []
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...await listFiles(p))
    else if (e.isFile() && e.name.endsWith('.org') && !e.name.includes('sync-conflict')) out.push(p)
  }
  return out
}

export async function listNotes(): Promise<NoteMeta[]> {
  const dir = getNotesDir()
  const files = await listFiles(dir)
  const notes: NoteMeta[] = []
  for (const f of files) {
    try {
      const meta = await readNoteMeta(f, dir)
      if (meta) notes.push(meta)
    } catch {
      // skip unreadable / malformed
    }
  }
  notes.sort((a, b) => b.updatedAt - a.updatedAt)
  return notes
}

async function readNoteMeta(fullPath: string, dir: string): Promise<NoteMeta | null> {
  const name = parseDenoteName(basename(fullPath))
  const raw = await readFile(fullPath, 'utf-8')
  const { header } = orgToJson(raw)
  const st = await stat(fullPath)
  return {
    id: name?.identifier ?? header.identifier || fallbackId(basename(fullPath)),
    filename: basename(fullPath),
    relPath: relative(dir, fullPath),
    folder: dirname(relative(dir, fullPath)) === '.' ? '' : dirname(relative(dir, fullPath)),
    title: header.title || name?.title || basename(fullPath, '.org'),
    date: header.date,
    tags: name?.tags ?? (header.filetags ? header.filetags.replace(/^:|:$/g, '').split(':').filter(Boolean) : []),
    public: header.public,
    updatedAt: st.mtimeMs
  }
}

function fallbackId(filename: string): string {
  return basename(filename, '.org').replace(/[^a-z0-9-]/gi, '-').slice(0, 60)
}

export function assertNoteId(id: string | undefined) {
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid note id' })
  }
  return id
}

export async function findNote(id: string): Promise<{ fullPath: string, dir: string }> {
  const dir = getNotesDir()
  const files = await listFiles(dir)
  for (const f of files) {
    const name = parseDenoteName(basename(f))
    if ((name?.identifier ?? fallbackId(basename(f))) === id) return { fullPath: f, dir }
  }
  throw createError({ statusCode: 404, statusMessage: 'Note not found' })
}

export async function readNote(id: string) {
  const { fullPath } = await findNote(id)
  const raw = await readFile(fullPath, 'utf-8')
  const { header, content } = orgToJson(raw)
  return {
    id,
    meta: {
      id,
      filename: basename(fullPath),
      title: header.title || id,
      public: header.public,
      tags: header.filetags ? header.filetags.replace(/^:|:$/g, '').split(':').filter(Boolean) : []
    },
    sourceHash: hashNote(content),
    content: { type: 'doc', content }
  }
}

function slugify(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'untitled'
}

export async function saveNote(id: string, body: { content?: Record<string, any> }) {
  if (!body?.content || typeof body.content !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'content is required' })
  }
  const { fullPath, dir } = await findNote(id)
  const raw = await readFile(fullPath, 'utf-8')
  const { header } = orgToJson(raw)

  const nextTitle = header.title
  const newContent = body.content

  // zero-edit no-op: if content unchanged, write original bytes verbatim
  if (body.sourceHash && body.sourceHash === hashNote(newContent)) {
    return { rewritten: false, id, meta: { id, title: nextTitle } }
  }

  const org = jsonToOrg(newContent, header)
  const tmp = `${fullPath}.${process.pid}.tmp`
  await writeFile(tmp, org, 'utf-8')
  await rename(tmp, fullPath)
  return { rewritten: true, id, meta: { id, title: nextTitle } }
}

export async function createNote(body: { title?: string, folder?: string }) {
  const title = body.title?.trim() || 'Untitled'
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const identifier = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const name = `${identifier}--${slugify(title)}.org`
  const folder = body.folder ? String(body.folder).replace(/^\/+|\/+$/g, '') : ''
  const targetDir = folder ? join(getNotesDir(), folder) : getNotesDir()
  await mkdir(targetDir, { recursive: true })
  const fullPath = join(targetDir, name)
  const org = `#+title: ${title}\n#+identifier: ${identifier}\n\n`
  await writeFile(fullPath, org, 'utf-8')
  return { id: identifier, filename: name, folder }
}

export async function removeNote(id: string) {
  const { fullPath } = await findNote(id)
  await unlink(fullPath)
}

export async function renameNoteFile(id: string, newTitle: string) {
  const { fullPath } = await findNote(id)
  const dir = dirname(fullPath)
  const raw = await readFile(fullPath, 'utf-8')
  const { header } = orgToJson(raw)
  const identifier = header.identifier || id
  const tags = header.filetags ? header.filetags.replace(/^:|:$/g, '') : ''
  const name = `${identifier}--${slugify(newTitle)}${tags ? `__${tags}` : ''}.org`
  if (name === basename(fullPath)) return
  const newPath = join(dir, name)
  await rename(fullPath, newPath)