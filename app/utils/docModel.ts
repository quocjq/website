// Document model over the TipTap-style JSON schema the server emits/consumes.
// Blocks: paragraph, heading{level}, bulletList/orderedList/taskList,
// codeBlock{language}, blockquote, table{row>cell}, taskItem{checked}
// Inline: text with marks: bold, italic, underline, strike, code, link{href}

export interface Mark { type: string, attrs?: Record<string, any> }
export interface InlineNode { type: 'text', text: string, marks?: Mark[] }
export interface BlockNode { type: string, attrs?: Record<string, any>, content?: any[] }
export interface DocNode { type: 'doc', content: BlockNode[] }

export const EMPTY_DOC: DocNode = { type: 'doc', content: [{ type: 'paragraph' }] }

export function textBlock(text: string): BlockNode {
  return { type: 'paragraph', content: text ? [{ type: 'text', text }] : [] }
}

export function emptyBlock(kind: string, attrs?: Record<string, any>): BlockNode {
  return { type: kind, ...(attrs ? { attrs } : {}) }
}

// --- mark helpers ---
export function toggleMark(node: InlineNode, mark: Mark): InlineNode {
  const marks = node.marks ?? []
  const exists = marks.some((m) => m.type === mark.type)
  const next = exists ? marks.filter((m) => m.type !== mark.type) : [...marks, mark]
  return { ...node, marks: next.length ? next : undefined }
}

export function hasMark(node: InlineNode | undefined, type: string): boolean {
  return !!node?.marks?.some((m) => m.type === type)
}

// html <-> inline json (for reading contenteditable block content)
export function inlineToHtml(node: InlineNode): string {
  let text = node.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
  for (const m of node.marks ?? []) {
    if (m.type === 'bold') text = `<strong>${text}</strong>`
    else if (m.type === 'italic') text = `<em>${text}</em>`
    else if (m.type === 'underline') text = `<u>${text}</u>`
    else if (m.type === 'strike') text = `<s>${text}</s>`
    else if (m.type === 'code') text = `<code>${text}</code>`
    else if (m.type === 'link') text = `<a href="${(m.attrs?.href ?? '').replace(/"/g, '&quot;')}">${text}</a>`
  }
  return text
}

export function htmlToInline(html: string): InlineNode[] {
  const doc = new DOMParser().parseFromString(`<p>${html}</p>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement
  const out: InlineNode[] = []
  const walk = (el: Node, marks: Mark[]) => {
    el.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? ''
        if (text) out.push({ type: 'text', text, marks: marks.length ? [...marks] : undefined })
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el2 = child as HTMLElement
        const tag = el2.tagName.toLowerCase()
        const next: Mark[] = [...marks]
        if (tag === 'strong' || tag === 'b') next.push({ type: 'bold' })
        else if (tag === 'em' || tag === 'i') next.push({ type: 'italic' })
        else if (tag === 'u') next.push({ type: 'underline' })
        else if (tag === 's' || tag === 'strike' || tag === 'del') next.push({ type: 'strike' })
        else if (tag === 'code') next.push({ type: 'code' })
        else if (tag === 'a') next.push({ type: 'link', attrs: { href: el2.getAttribute('href') ?? '' } })
        else if (tag === 'br') { out.push({ type: 'text', text: '\n' }); return }
        walk(child, next)
      }
    })
  }
  walk(root, [])
  return out
}

// --- block helpers ---
export function isListBlock(type: string): boolean {
  return type === 'bulletList' || type === 'orderedList' || type === 'taskList'
}

export function isTaskBlock(type: string): boolean {
  return type === 'taskList'
}

export function plainTextOfContent(content?: any[]): string {
  return (content ?? []).map((n: any) => n.type === 'text' ? n.text : plainTextOfContent(n.content)).join('')
}

export function blockToParagraph(block: BlockNode): BlockNode {
  const text = plainTextOfContent(block.content)
  return textBlock(text)
}

export function paragraphContentToBlocks(content?: any[]): BlockNode[] {
  // split \n inside a paragraph into separate paragraphs
  const chunks: string[] = []
  let cur = ''
  for (const n of content ?? []) {
    if (n.type === 'text') {
      const parts = n.text.split('\n')
      parts.forEach((p: string, i: number) => {
        cur += p
        if (i < parts.length - 1) { chunks.push(cur); cur = '' }
      })
    } else {
      cur += n.text ?? ''
    }
  }
  if (cur || chunks.length === 0) chunks.push(cur)
  return chunks.filter((c) => c !== '' || chunks.length === 1).map(textBlock)
}

export function contentToHtml(content?: any[]): string {
  return (content ?? []).map((n: any) => n.type === 'text' ? inlineToHtml(n) : '').join('')
}

export function htmlToParagraphContent(html: string): InlineNode[] {
  return htmlToInline(html).flatMap((n) =>
    n.text.includes('\n') ? n.text.split('\n').map((t) => ({ ...n, text: t })) : [n]
  )
}

// --- table ops ---
export function emptyTable(rows = 2, cols = 2): BlockNode {
  const row = (header: boolean) => ({
    type: 'tableRow',
    attrs: header ? { header: true } : {},
    content: Array.from({ length: cols }, () => ({
      type: 'tableCell',
      attrs: header ? { header: true } : {},
      content: [{ type: 'paragraph' }]
    }))
  })
  return { type: 'table', attrs: { colgroup: [], cellMinWidth: 48 }, content: [row(true), ...Array.from({ length: rows - 1 }, () => row(false))] }
}

export function getTableRows(table: BlockNode): any[] {
  return (table.content ?? []).filter((r: any) => r.type === 'tableRow')
}

export function addTableRow(table: BlockNode, after?: number): BlockNode {
  const rows = getTableRows(table)
  const ncols = rows[0]?.content?.length ?? 2
  const idx = after ?? rows.length - 1
  const newRow = {
    type: 'tableRow',
    content: Array.from({ length: ncols }, () => ({ type: 'tableCell', content: [{ type: 'paragraph' }] }))
  }
  const content = [...(table.content ?? [])]
  content.splice(idx + 1, 0, newRow)
  return { ...table, content }
}

export function addTableCol(table: BlockNode): BlockNode {
  const content = (table.content ?? []).map((r: any) => ({
    ...r,
    content: [...(r.content ?? []), { type: 'tableCell', content: [{ type: 'paragraph' }] }]
  }))
  return { ...table, content }
}
