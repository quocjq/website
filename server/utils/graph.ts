import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { parseOrg } from './org'
import { listNotes, getNotesDir, dayOfId, type NoteMeta } from './notes'

export interface GraphNode {
  id: string
  title: string
  filename: string
  day: string
}

export interface GraphEdge {
  from: string
  to: string
  kind: string
}

export interface NoteGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

function walkLinks(node: any, out: Array<{ type: string, path: string }>): void {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const child of node) walkLinks(child, out)
    return
  }
  if (node.type === 'link') {
    const linkType = String(node.linkType ?? '')
    const path = String(node.path ?? '')
    if (linkType && path) out.push({ type: linkType, path })
  }
  for (const key of ['children', 'content']) {
    if (node[key] !== undefined) walkLinks(node[key], out)
  }
}

export async function buildGraph(): Promise<NoteGraph> {
  const notes = await listNotes()
  const byId = new Map<string, NoteMeta>()
  const byFilename = new Map<string, NoteMeta>()
  for (const n of notes) {
    byId.set(n.id, n)
    byFilename.set(n.filename, n)
  }

  const nodes: GraphNode[] = notes.map((n) => ({
    id: n.id,
    title: n.title,
    filename: n.filename,
    day: n.day
  }))

  const edges: GraphEdge[] = []
  const seen = new Set<string>()
  const dir = getNotesDir()

  for (const n of notes) {
    let raw: string
    try {
      raw = await readFile(`${dir}/${n.relPath}`, 'utf-8')
    } catch {
      continue
    }
    const links: Array<{ type: string, path: string }> = []
    walkLinks(parseOrg(raw), links)
    for (const link of links) {
      // uniorg has no "denote" protocol: [[denote:ID]] parses as fuzzy path "denote:ID"
      let type = link.type
      let path = link.path
      const colon = path.indexOf(':')
      if (type === 'fuzzy' && colon > 0) {
        const proto = path.slice(0, colon)
        if (proto === 'denote' || proto === 'id' || proto === 'file') {
          type = proto
          path = path.slice(colon + 1)
        }
      }
      const target = type === 'denote' || type === 'id'
        ? byId.get(path)
        : byFilename.get(path)
      if (!target) continue
      const key = `${n.id}|${target.id}|${type}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push({ from: n.id, to: target.id, kind: type })
    }
  }

  return { nodes, edges }
}

export { dayOfId }
