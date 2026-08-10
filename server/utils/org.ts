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
