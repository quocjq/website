import { readdir, readFile, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export interface NoteMeta {
  id: string
  filename: string
  title: string
  tags: string[]
  date: string
  public: boolean
}

const DENOTE_RE = /^(\d{8}T\d{6})--(.+?)(?:__([^_.]+))?\.org$/

function notesDir(): string {
  return resolve(process.env.NOTES_DIR ?? '/root/Notes')
}

function parseKeywords(content: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /^#\+(\w+):\s*(.*)$/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) {
    const key = m[1].toLowerCase()
    if (!(key in out)) out[key] = m[2].trim()
  }
  return out
}

function parseTags(keywords: Record<string, string>, filenameTags: string): string[] {
  const tagText = keywords.filetags ?? keywords.tags ?? filenameTags
  const tags = tagText
    .replace(/[^\w:]/g, ' ')   // keep word chars + colons (org " :tag:" syntax)
    .split(/[:\s]+/)
    .filter((t) => t.length > 0)
  return tags
}

export function parseFilename(filename: string): { id: string; date: string; nameTags: string } | null {
  const m = filename.match(DENOTE_RE)
  if (!m) return null
  const id = m[1]
  const date = `${id.slice(0, 4)}-${id.slice(4, 6)}-${id.slice(6, 8)}`
  return { id, date, nameTags: m[3] ?? '' }
}

export async function readNote(filepath: string): Promise<NoteMeta | null> {
  const filename = resolve(filepath).split('/').pop() ?? ''
  const file = parseFilename(filename)
  if (!file) return null

  const content = await readFile(filepath, 'utf-8')
  const keywords = parseKeywords(content)

  const title = keywords.title ?? filename.replace(/\.org$/, '').split('__')[0].split('--').pop() ?? filename
  const tags = parseTags(keywords, file.nameTags)

  return {
    id: file.id,
    filename,
    title,
    tags,
    date: keywords.date?.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? file.date,
    public: keywords.public === 't' || keywords.public === 'true',
  }
}

export async function listNotes(): Promise<NoteMeta[]> {
  const dir = notesDir()
  let entries: string[]
  try {
    entries = await readdir(dir)
  } catch {
    return []
  }

  const notes: NoteMeta[] = []
  for (const filename of entries) {
    if (!filename.endsWith('.org')) continue
    const filepath = join(dir, filename)
    try {
      const note = await readNote(filepath)
      if (note) notes.push(note)
    } catch {
      // unreadable note: skip
    }
  }
  return notes
}

export async function getNoteById(id: string): Promise<{ meta: NoteMeta; content: string } | null> {
  const dir = notesDir()
  let entries: string[]
  try {
    entries = await readdir(dir)
  } catch {
    return null
  }

  for (const filename of entries) {
    if (!filename.endsWith('.org')) continue
    if (parseFilename(filename)?.id !== id) continue
    const filepath = join(dir, filename)
    try {
      const content = await readFile(filepath, 'utf-8')
      const meta = await readNote(filepath)
      return meta ? { meta, content } : null
    } catch {
      return null
    }
  }
  return null
}

export async function fileLastModified(id: string): Promise<number> {
  const dir = notesDir()
  try {
    const entries = await readdir(dir)
    for (const filename of entries) {
      if (!filename.endsWith('.org')) continue
      if (parseFilename(filename)?.id !== id) continue
      const s = await stat(join(dir, filename))
      return s.mtimeMs
    }
  } catch {
    // fall through
  }
  return Date.now()
}

export function notesDirPath(): string {
  return notesDir()
}
