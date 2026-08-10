import { unified } from 'unified'
import parse from 'uniorg-parse'
import rehype from 'uniorg-rehype'
import htmlStringify from 'rehype-stringify'
import type { OrgData } from 'uniorg'

export interface NoteHeader {
  title: string
  date: string
  filetags: string
  identifier: string
  public: boolean
}

export const EMPTY_HEADER: NoteHeader = {
  title: '',
  date: '',
  filetags: '',
  identifier: '',
  public: false
}

export function parseOrg(org: string): OrgData {
  return unified().use(parse).parse(org) as OrgData
}

export function extractHeader(org: string): NoteHeader {
  const ast = parseOrg(org)
  const header = { ...EMPTY_HEADER }
  for (const node of ast.children) {
    if (node.type !== 'keyword') continue
    const key = (node as any).key
    const value = ((node as any).value ?? '').trim()
    if (key === 'TITLE') header.title = value
    else if (key === 'DATE') header.date = value
    else if (key === 'FILETAGS') header.filetags = value
    else if (key === 'IDENTIFIER') header.identifier = value
    else if (key === 'PUBLIC') header.public = value === 't' || value === 'true'
  }
  return header
}

export function orgToHtml(org: string): Promise<string> {
  return unified()
    .use(parse)
    .use((rehype as any).default ?? rehype)
    .use(htmlStringify)
    .process(org)
    .then((f) => f.toString())
}

export interface TocEntry {
  level: number
  title: string
  slug: string
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u00e0-\u00ff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'section'
}

function walkHeadlines(node: any, out: TocEntry[]): void {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const child of node) walkHeadlines(child, out)
    return
  }
  if (node.type === 'headline') {
    const title = String((node as any).rawValue ?? '')
    if (title) {
      out.push({ level: (node as any).level ?? 1, title, slug: slugifyHeading(title) })
    }
  }
  for (const key of ['children', 'content']) {
    if (node[key] !== undefined) walkHeadlines(node[key], out)
  }
}

export function buildToc(org: string): TocEntry[] {
  const ast = parseOrg(org)
  const toc: TocEntry[] = []
  walkHeadlines(ast, toc)
  return toc
}

export function orgToHtmlWithToc(org: string): Promise<{ html: string, toc: TocEntry[] }> {
  return orgToHtml(org).then((html) => {
    const toc = buildToc(org)
    if (toc.length === 0) return { html, toc }
    // inject id="<slug>" into headings in document order (matches AST order)
    let i = 0
    const withIds = html.replace(/<h([1-6])([^>]*)>/g, (m, level, attrs) => {
      const entry = toc[i]
      i++
      if (!entry || entry.level !== Number(level)) return m
      const id = ` id="${entry.slug}"`
      return `<h${level}${attrs}${attrs.includes('id=') ? '' : id}>`
    })
    return { html: withIds, toc }
  })
}
