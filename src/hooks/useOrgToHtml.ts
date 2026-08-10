import { useMemo } from 'react'
import { unified } from 'unified'
import uniorgParse from 'uniorg-parse'
import uniorgRehype from 'uniorg-rehype'
import rehypeStringify from 'rehype-stringify'
import type { Element, Root } from 'hast'

export interface TocEntry {
  level: number
  text: string
  id: string
}

export interface OrgRender {
  html: string
  toc: TocEntry[]
  readingTime: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function collectToc(root: Root): TocEntry[] {
  const toc: TocEntry[] = []
  const visit = (node: Element | Root) => {
    if (node.type === 'element') {
      const m = /^h([1-6])$/.exec(node.tagName)
      if (m && node.children) {
        const text = node.children
          .map((c) => ('value' in c ? c.value : ''))
          .join('')
        const id = node.properties?.id ?? slugify(text)
        if (node.properties) node.properties.id = id
        toc.push({ level: Number(m[1]), text, id })
      }
    }
    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (child.type === 'element') visit(child)
      }
    }
  }
  visit(root)
  return toc
}

export function useOrgToHtml(content: string): OrgRender {
  return useMemo(() => {
    const processor = unified().use(uniorgParse).use(uniorgRehype)
    const tree = processor.parse(content)
    const root = processor.runSync(tree) as Root
    const toc = collectToc(root)
    const html = String(unified().use(rehypeStringify).stringify(root))

    const words = content.split(/\s+/).filter((w) => w.length > 0).length
    const readingTime = Math.max(1, Math.round(words / 200))

    return { html, toc, readingTime }
  }, [content])
}
