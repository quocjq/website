import { unified } from 'unified'
import parse from 'uniorg-parse'
import { uniorgStringify } from 'uniorg-stringify'
import type { OrastRoot, OrastNode } from 'uniorg'

export interface NoteHeader {
  title: string
  date: string
  filetags: string
  identifier: string
  public: boolean
  rawKeywords: string[]
}

const EMPTY_HEADER: NoteHeader = {
  title: '',
  date: '',
  filetags: '',
  identifier: '',
  public: false,
  rawKeywords: []
}

function textOf(node: OrastNode | undefined): string {
  if (!node) return ''
  if ('value' in node && typeof node.value === 'string') return node.value
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(textOf).join('')
  }
  return ''
}

export function parseHeader(ast: OrastRoot): NoteHeader {
  const header = { ...EMPTY_HEADER }
  header.rawKeywords = ast.children
    .filter((n: any): n is any => n.type === 'keyword')
    .map((k: any) => `#+${k.key}: ${k.value}`)

  for (const k of ast.children) {
    if (k.type !== 'keyword') continue
    const key = (k as any).key
    const value = ((k as any).value ?? '').trim()
    if (key === 'TITLE') header.title = value
    else if (key === 'DATE') header.date = value
    else if (key === 'FILETAGS') header.filetags = value
    else if (key === 'IDENTIFIER') header.identifier = value
    else if (key === 'PUBLIC') header.public = value === 't' || value === 'true'
  }
  return header
}

function toMarks(node: OrastNode): Array<{ type: string, attrs?: Record<string, unknown> }> {
  const marks: Array<{ type: string, attrs?: Record<string, unknown> }> = []
  const t = node.type
  if (t === 'bold') marks.push({ type: 'bold' })
  if (t === 'italic') marks.push({ type: 'italic' })
  if (t === 'underline') marks.push({ type: 'underline' })
  if (t === 'strike-through') marks.push({ type: 'strike' })
  if (t === 'code' || t === 'verbatim') marks.push({ type: 'code' })
  return marks
}

function inlineChildren(children: OrastNode[]): any[] {
  const out: any[] = []
  for (const child of children) {
    if (child.type === 'text') {
      const text = (child as any).value ?? ''
      out.push({ type: 'text', text })
    } else if (child.type === 'bold' || child.type === 'italic' || child.type === 'underline' || child.type === 'strike-through' || child.type === 'code' || child.type === 'verbatim') {
      const mark = toMarks(child)
      const innerChildren = (child as any).children ?? []
      if (innerChildren.length) {
        const inner = inlineChildren(innerChildren)
        for (const piece of inner) {
          if (piece.type === 'text') {
            piece.marks = [...(piece.marks ?? []), ...mark]
          }
        }
        out.push(...inner)
      } else {
        const txt = (child as any).value ?? ''
        if (txt) out.push({ type: 'text', text: txt, marks: [...mark] })
      }
    } else if (child.type === 'link') {
      const raw = (child as any).path ?? (child as any).rawLink ?? ''
      const label = textOf(child)
      out.push({
        type: 'text',
        text: label || raw,
        marks: [{ type: 'link', attrs: { href: raw } }]
      })
    } else if (child.type === 'line-break') {
      out.push({ type: 'text', text: '\n' })
    } else {
      const txt = textOf(child)
      if (txt) out.push({ type: 'text', text: txt })
    }
  }
  return out
}

function blockFromParagraph(children: OrastNode[]): any[] {
  const inline = inlineChildren(children)
  if (inline.length === 0) return [{ type: 'paragraph' }]
  return [{ type: 'paragraph', content: inline }]
}

function toJsonBlock(node: OrastNode): any[] {
  switch (node.type) {
    case 'headline': {
      const level = Math.min(6, Math.max(1, (node as any).level ?? 1))
      const text = inlineChildren((node as any).children ?? [])
      return [{ type: 'heading', attrs: { level }, content: text }]
    }
    case 'paragraph':
      return blockFromParagraph((node as any).children ?? [])
    case 'plain-list': {
      const ordered = (node as any).listType === 'ordered'
      const items = ((node as any).children ?? []).map((li: any) => {
        const checkbox = li.checkbox
        const content = blockFromParagraph(li.children?.[0]?.children ?? [])
        return {
          type: 'listItem',
          attrs: checkbox ? { checkbox: checkbox === '[X]' ? true : false, checked: checkbox === '[X]' } : undefined,
          content: checkbox
            ? [{ type: 'paragraph', content: [{ type: 'text', text: '', marks: [] }] }, ...content]
            : content
        }
      })
      if (ordered) return [{ type: 'orderedList', attrs: { start: (node as any).start ?? 1 }, content: items }]
      const hasCheckbox = items.some((i: any) => i.attrs?.checkbox !== undefined)
      return hasCheckbox
        ? [{ type: 'taskList', content: items.map((i: any) => ({ ...i, type: 'taskItem' })) }]
        : [{ type: 'bulletList', content: items }]
    }
    case 'table': {
      const rows = ((node as any).children ?? [])
        .filter((r: any) => r.type === 'table-row' && r.rowType !== 'rule')
        .map((r: any, idx: number) => ({
          type: 'tableRow',
          attrs: idx === 0 ? { header: true } : {},
          content: (r.children ?? []).map((c: any) => ({
            type: 'tableCell',
            attrs: idx === 0 ? { header: true } : {},
            content: blockFromParagraph(c.children ?? [])
          }))
        }))
      return [{ type: 'table', attrs: { colgroup: [], cellMinWidth: 48 }, content: rows }]
    }
    case 'src-block':
      return [{
        type: 'codeBlock',
        attrs: { language: (node as any).language || null },
        content: [{ type: 'text', text: (node as any).value ?? '' }]
      }]
    case 'example-block':
      return [{ type: 'codeBlock', content: [{ type: 'text', text: (node as any).value ?? '' }] }]
    case 'blockquote': {
      const inner = ((node as any).children ?? []).flatMap(toJsonBlock)
      return [{ type: 'blockquote', content: inner.length ? inner : [{ type: 'paragraph' }] }]
    }
    case 'section': {
      const children = (node as any).children ?? []
      const blocks = children.flatMap(toJsonBlock)
      // trailing empty paragraph from trailing newline
      if (blocks.length && blocks[blocks.length - 1]?.type === 'paragraph' && !blocks[blocks.length - 1].content) {
        blocks.pop()
      }
      return blocks
    }
    case 'org-data': {
      return ((node as any).children ?? []).flatMap(toJsonBlock)
    }
    case 'keyword':
    case 'meta':
      return []
    default: {
      // passthrough: unparsed constructs render as literal text
      const txt = textOf(node).trimEnd()
      if (!txt) return []
      return [{ type: 'paragraph', content: [{ type: 'text', text: txt }] }]
    }
  }
}

export function orgToJson(org: string): { header: NoteHeader, content: any } {
  const ast = unified().use(parse).parse(org) as OrastRoot
  const header = parseHeader(ast)
  const content = toJsonBlock(ast)
  return { header, content }
}

function escapeOrgText(text: string): string {
  return text.replace(/[*_~=]/g, (ch) => `\\${ch}`)
}

function jsonMarksToOrg(text: string, marks?: Array<{ type: string, attrs?: Record<string, unknown> }>): string {
  let out = escapeOrgText(text)
  for (const m of marks ?? []) {
    if (m.type === 'bold') out = `*${out}*`
    else if (m.type === 'italic') out = `/${out}/`
    else if (m.type === 'underline') out = `_${out}_`
    else if (m.type === 'strike') out = `+${out}+`
    else if (m.type === 'code') out = `=${out}=`
    else if (m.type === 'link') {
      const href = (m.attrs?.href as string) ?? ''
      out = `[[${href}][${out}]]`
    }
  }
  return out
}

function jsonInline(node: any): string {
  if (node.type === 'text') {
    return jsonMarksToOrg(node.text ?? '', node.marks)
  }
  return jsonInlineNodes(node.content)
}

function jsonInlineNodes(content?: any[]): string {
  return (content ?? []).map(jsonInline).join('')
}

function jsonBlockToOrg(node: any): string[] {
  const lines: string[] = []
  switch (node.type) {
    case 'heading': {
      const level = node.attrs?.level ?? 1
      const stars = '*'.repeat(Math.min(6, level))
      lines.push(`${stars} ${jsonInlineNodes(node.content)}`.trimEnd())
      break
    }
    case 'paragraph':
      lines.push(jsonInlineNodes(node.content))
      break
    case 'bulletList':
    case 'orderedList':
    case 'taskList': {
      const ordered = node.type === 'orderedList'
      for (const [i, item] of (node.content ?? []).entries()) {
        const text = item.content?.map((c: any) => c.type === 'paragraph' ? jsonInline(c) : jsonBlockToOrg(c).join('\n')).filter(Boolean).join(' ')
        let bullet = ordered ? `${(node.attrs?.start ?? 1) + i}. ` : '- '
        if (node.type === 'taskList') {
          const checked = item.attrs?.checked === true || item.attrs?.checkbox === true
          bullet = `- [${checked ? 'X' : ' '}] `
        }
        const sub = item.content?.filter((c: any) => c.type !== 'paragraph') ?? []
        lines.push(`${bullet}${text ?? ''}`)
        for (const s of sub) lines.push(...jsonBlockToOrg(s).map((l) => `  ${l}`))
      }
      break
    }
    case 'table': {
      const rows = (node.content ?? []).map((r: any) =>
        (r.content ?? []).map((c: any) => c.content?.map(jsonInline).join(' ') ?? '').join(' | ')
      )
      lines.push(`| ${rows[0] ?? ''} |`)
      if (rows.length > 1) {
        const n = rows[0]?.split(' | ').length ?? 1
        lines.push('|' + '---+'.repeat(n))
        for (const r of rows.slice(1)) lines.push(`| ${r} |`)
      }
      break
    }
    case 'codeBlock': {
      const lang = node.attrs?.language || ''
      const code = node.content?.[0]?.text ?? ''
      lines.push(`#+begin_src ${lang}`.trimEnd())
      lines.push(code.replace(/\n$/, ''))
      lines.push('#+end_src')
      break
    }
    case 'blockquote': {
      const inner = (node.content ?? []).flatMap(jsonBlockToOrg)
      lines.push('#+begin_quote')
      lines.push(...inner)
      lines.push('#+end_quote')
      break
    }
    default:
      break
  }
  return lines
}

export function jsonToOrg(content: any, header: NoteHeader): string {
  const kw = header.rawKeywords.length
    ? header.rawKeywords
    : [
        `#+title: ${header.title}`,
        ...(header.date ? [`#+date: ${header.date}`] : []),
        ...(header.filetags ? [`#+filetags: ${header.filetags}`] : []),
        ...(header.identifier ? [`#+identifier: ${header.identifier}`] : []),
        ...(header.public ? ['#+public: t'] : [])
      ]
  const body = (content?.content ?? []).flatMap(jsonBlockToOrg)
  const out = [...kw, ...(kw.length ? [''] : []), ...body, '']
  return out.join('\n')
}

export function hashNote(content: any): string {
  return JSON.stringify(content)
}
