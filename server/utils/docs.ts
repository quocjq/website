import { mkdir, readdir, readFile, writeFile, unlink } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { createError } from 'h3'

export interface DocMeta {
  id: string
  title: string
  updatedAt: string
}

export interface StoredDoc extends DocMeta {
  content: Record<string, unknown>
}

export const EMPTY_CONTENT = { type: 'doc', content: [{ type: 'paragraph' }] }

export const DOC_ID_PATTERN = /^[a-z0-9-]+$/

export function getDocsDir() {
  return process.env.DOCS_DIR || './.data/docs'
}

export function assertDocId(id: string | undefined) {
  if (!id || !DOC_ID_PATTERN.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid document id' })
  }
  return id
}

export async function ensureDocsDir() {
  await mkdir(getDocsDir(), { recursive: true })
}

export async function readStoredDoc(id: string): Promise<StoredDoc> {
  const file = join(getDocsDir(), `${id}.json`)
  const raw = await readFile(file, 'utf-8')
  return JSON.parse(raw) as StoredDoc
}

export function extractText(node: Record<string, any> | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  let out = ''
  for (const child of node.content ?? []) {
    out += extractText(child)
  }
  return out
}

export function deriveTitle(content: Record<string, any> | undefined): string {
  let headingText = ''
  for (const node of content?.content ?? []) {
    if (node?.type === 'paragraph') {
      const text = extractText(node).trim()
      if (text) return text.slice(0, 80)
    }
    if (node?.type === 'heading' && !headingText) {
      headingText = extractText(node).trim().slice(0, 80)
    }
  }
  return headingText || 'Untitled'
}

export async function saveDoc(id: string, content: Record<string, unknown>): Promise<StoredDoc> {
  await ensureDocsDir()
  const doc: StoredDoc = {
    id,
    title: deriveTitle(content),
    updatedAt: new Date().toISOString(),
    content
  }
  await writeFile(join(getDocsDir(), `${id}.json`), JSON.stringify(doc, null, 2), 'utf-8')
  return doc
}

export async function listDocs(): Promise<DocMeta[]> {
  await ensureDocsDir()
  const dir = getDocsDir()
  const entries = await readdir(dir)

  const ids = entries
    .filter((f) => f.endsWith('.json'))
    .map((f) => basename(f, '.json'))
    .filter((id) => DOC_ID_PATTERN.test(id))

  const docs = await Promise.all(ids.map(async (id): Promise<DocMeta> => {
    try {
      const doc = await readStoredDoc(id)
      return { id, title: doc.title || 'Untitled', updatedAt: doc.updatedAt || '' }
    } catch {
      return { id, title: 'Untitled', updatedAt: '' }
    }
  }))

  docs.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  return docs
}

export async function removeDoc(id: string) {
  await unlink(join(getDocsDir(), `${id}.json`))
}
