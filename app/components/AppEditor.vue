<script setup lang="ts">
import {
  EMPTY_DOC,
  contentToHtml,
  htmlToParagraphContent,
  textBlock,
  emptyBlock,
  getTableRows,
  addTableRow,
  addTableCol,
  emptyTable,
  type DocNode,
  type BlockNode,
  type InlineNode
} from '../utils/docModel'

const props = withDefaults(defineProps<{
  modelValue: DocNode
  editable?: boolean
  placeholder?: string
}>(), { editable: true, placeholder: 'Write something…' })

const emit = defineEmits<{ 'update:modelValue': [DocNode] }>()

const doc = ref<DocNode>({ ...EMPTY_DOC })
const activeIndex = ref(0)
const blockEls = ref<Record<number, HTMLElement | null>>({})
// during typing the DOM is source of truth; we emit the new model without
// re-rendering v-html (that would reset the caret). pendingEmitted lets the
// modelValue watcher recognize our own emission and skip the render.
let pendingEmitted: DocNode | null = null

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    if (ka.length !== kb.length) return false
    return ka.every((k) => deepEqual(a[k], b[k]))
  }
  return false
}

watch(() => props.modelValue, (v) => {
  if (pendingEmitted && deepEqual(v, pendingEmitted)) {
    pendingEmitted = null
    return
  }
  doc.value = structuredClone(v)
}, { immediate: true })

function blocks(): BlockNode[] {
  return doc.value.content as BlockNode[]
}

function blockAt(i: number): BlockNode {
  return blocks()[i]!
}

function emitDoc() {
  emit('update:modelValue', structuredClone(doc.value))
}

function setBlock(i: number, block: BlockNode) {
  const next = [...doc.value.content]
  next[i] = block
  doc.value = { type: 'doc', content: next }
  emitDoc()
}

function removeBlock(i: number) {
  const next = [...doc.value.content]
  next.splice(i, 1)
  if (!next.length) next.push(textBlock(''))
  doc.value = { type: 'doc', content: next }
  emitDoc()
  activeIndex.value = Math.max(0, i - 1)
}

function insertBlockAfter(i: number, block: BlockNode) {
  const next = [...doc.value.content]
  next.splice(i + 1, 0, block)
  doc.value = { type: 'doc', content: next }
  emitDoc()
  activeIndex.value = i + 1
}

function plainTextOf(block: BlockNode | undefined): string {
  return (block?.content ?? []).map((n: any) => n.type === 'text' ? n.text : '').join('')
}

function onInput(i: number, el: HTMLElement) {
  const block = blockAt(i)
  const content = htmlToParagraphContent(el.innerHTML)
  const next = [...doc.value.content]
  next[i] = { ...block, content: content.length ? content : undefined } as BlockNode
  const emitted: DocNode = { type: 'doc', content: next }
  pendingEmitted = emitted
  emit('update:modelValue', structuredClone(emitted))
}

function onListItemInput(i: number, j: number, el: HTMLElement) {
  const block = blockAt(i)
  const items = [...(block.content ?? [])]
  const item = items[j]
  const content = htmlToParagraphContent(el.innerHTML)
  items[j] = { ...item, content: [{ type: 'paragraph', content: content.length ? content : undefined }] }
  const next = [...doc.value.content]
  next[i] = { ...block, content: items } as BlockNode
  pendingEmitted = { type: 'doc', content: next }
  emit('update:modelValue', structuredClone({ type: 'doc', content: next }))
}

function onTableCellInput(i: number, realRowIdx: number, ci: number, el: HTMLElement) {
  const block = blockAt(i)
  const rows = [...(block.content ?? [])]
  const row = rows[realRowIdx]
  if (!row) return
  const cells = [...(row.content ?? [])]
  const content = htmlToParagraphContent(el.innerHTML)
  cells[ci] = { ...cells[ci], content: [{ type: 'paragraph', content: content.length ? content : undefined }] }
  rows[realRowIdx] = { ...row, content: cells }
  const next = [...doc.value.content]
  next[i] = { ...block, content: rows } as BlockNode
  pendingEmitted = { type: 'doc', content: next }
  emit('update:modelValue', structuredClone({ type: 'doc', content: next }))
}

function toggleTask(i: number, j: number) {
  const block = blockAt(i)
  const items = [...(block.content ?? [])]
  const item = items[j]
  items[j] = { ...item, attrs: { checked: !item.attrs?.checked } }
  setBlock(i, { ...block, content: items } as BlockNode)
}

// --- block conversions ---
function convertBlock(i: number, kind: string, attrs?: Record<string, any>) {
  const block = blockAt(i)
  const text = plainTextOf(block)
  if (kind === 'paragraph') { setBlock(i, textBlock(text)); return }
  if (kind === 'heading') { setBlock(i, { type: 'heading', attrs: { level: attrs?.level ?? 2 }, content: text ? [{ type: 'text', text }] : [] }); return }
  if (kind === 'codeBlock') { setBlock(i, { type: 'codeBlock', attrs: { language: attrs?.language || null }, content: text ? [{ type: 'text', text }] : [] }); return }
  if (kind === 'blockquote') { setBlock(i, { type: 'blockquote', content: [textBlock(text)] }); return }
  if (kind === 'bulletList' || kind === 'orderedList') {
    const li = { type: 'listItem', content: [textBlock(text)] }
    setBlock(i, { type: kind, content: [li] })
    return
  }
  if (kind === 'taskList') {
    const li = { type: 'taskItem', attrs: { checked: false }, content: [textBlock(text)] }
    setBlock(i, { type: 'taskList', content: [li] })
    return
  }
  if (kind === 'table') { setBlock(i, emptyTable()); return }
}

function activeBlock(): BlockNode | undefined {
  return blocks()[activeIndex.value]
}

function isActiveKind(kind: string): boolean {
  return activeBlock()?.type === kind
}
function isActiveHeading(level: number): boolean {
  const b = activeBlock()
  return b?.type === 'heading' && b.attrs?.level === level
}

// --- marks via execCommand on active editable block ---
function focusActiveBlock() {
  const el = blockEls.value[activeIndex.value]
  if (!el) return false
  el.focus()
  return true
}

function exec(cmd: string, val?: string) {
  if (!focusActiveBlock()) return
  document.execCommand(cmd, false, val)
  const el = blockEls.value[activeIndex.value]
  if (el) onInput(activeIndex.value, el)
}

function toggleMark(mark: string) {
  if (mark === 'bold') exec('bold')
  else if (mark === 'italic') exec('italic')
  else if (mark === 'underline') exec('underline')
  else if (mark === 'strike') exec('strikeThrough')
  else if (mark === 'code') {
    // wrap selection in <code>
    if (!focusActiveBlock()) return
    document.execCommand('styleWithCSS', false, 'false')
    document.execCommand('insertHTML', false, `<code>\u200b</code>`)
  }
}

function hasExecMark(mark: string): boolean {
  const el = blockEls.value[activeIndex.value]
  if (!el) return false
  const q = mark === 'bold' ? 'b,strong' : mark === 'italic' ? 'i,em' : mark === 'underline' ? 'u' : mark === 'strike' ? 's,strike,del' : mark === 'code' ? 'code' : 'none'
  return !!el.querySelector(q)
}

function setLink(href: string) {
  if (!focusActiveBlock()) return
  if (href) exec('createLink', href)
  else exec('unlink')
}

// --- keyboard ---
function onKeydown(e: KeyboardEvent, i: number) {
  const block = blockAt(i)
  const el = blockEls.value[i]
  if (!el) return
  const sel = window.getSelection()
  const atEnd = sel && sel.focusNode && sel.focusOffset === sel.focusNode.textContent?.length

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    const text = plainTextOf(block)
    if (isListBlock(block.type) || block.type === 'taskList') {
      // Enter adds a new item
      const item = { type: 'listItem', content: [textBlock('')] }
      const items = [...(block.content ?? []), item]
      setBlock(i, { ...block, content: items } as BlockNode)
      nextTick(() => {
        const el2 = blockEls.value[i]
        const last = el2?.querySelector('li:last-child') as HTMLElement | null
        last?.focus()
      })
    } else if (block.type === 'codeBlock') {
      // allow newline inside code block
      document.execCommand('insertText', false, '\n')
      onInput(i, el)
    } else {
      // split: keep text up to cursor in this block, rest in new paragraph
      const sel2 = window.getSelection()
      const offset = sel2?.focusOffset ?? text.length
      const keep = text.slice(0, offset)
      const rest = text.slice(offset)
      setBlock(i, { ...block, content: keep ? [{ type: 'text', text: keep }] : [] } as BlockNode)
      insertBlockAfter(i, textBlock(rest))
      nextTick(() => {
        const el2 = blockEls.value[i + 1]
        if (el2) {
          el2.focus()
          const r = document.createRange()
          r.selectNodeContents(el2)
          r.collapse(false)
          const s = window.getSelection()
          s?.removeAllRanges()
          s?.addRange(r)
        }
      })
    }
  } else if (e.key === 'Backspace') {
    const text = plainTextOf(block)
    const sel2 = window.getSelection()
    const atStart = sel2 && sel2.focusOffset === 0
    if (text === '' || atStart) {
      if (text === '' && block.type !== 'paragraph') {
        e.preventDefault()
        setBlock(i, textBlock(''))
      } else if (text === '' && i > 0) {
        e.preventDefault()
        removeBlock(i)
      }
    }
  } else if (e.key === 'Tab' && (block.type === 'taskList')) {
    e.preventDefault()
    const items = block.content ?? []
    const first = items[0]
    if (first?.type === 'taskItem') {
      const checked = !first.attrs?.checked
      setBlock(i, { ...block, content: items.map((it: any, j: number) => j === 0 ? { ...it, attrs: { checked } } : it) } as BlockNode)
    }
  }
}

function isListBlock(t: string): boolean {
  return t === 'bulletList' || t === 'orderedList'
}

function setBlockEl(i: number, el: any) {
  blockEls.value[i] = el
}

function realRowIndexOf(block: BlockNode, target: any): number {
  return (block.content ?? []).findIndex((r: any) => r === target)
}

defineExpose({
  convertBlock,
  isActiveKind,
  isActiveHeading,
  insertBlockAfter,
  removeBlock,
  activeIndex,
  toggleMark,
  hasExecMark,
  setLink,
  focus: () => {
    const el = blockEls.value[activeIndex.value]
    if (el) {
      el.focus()
      const r = document.createRange()
      r.selectNodeContents(el)
      r.collapse(false)
      const s = window.getSelection()
      s?.removeAllRanges()
      s?.addRange(r)
    }
  }
})
</script>

<template>
  <div class="app-editor">
    <div
      v-for="(block, i) in blocks()"
      :key="i"
      class="group relative"
    >
      <!-- paragraph / heading -->
      <component
        :is="block.type === 'heading' ? `h${block.attrs?.level ?? 2}` : 'p'"
        v-if="block.type === 'paragraph' || block.type === 'heading'"
        :ref="(el: any) => setBlockEl(i, el)"
        :contenteditable="editable"
        spellcheck="false"
        class="outline-none"
        :class="{ 'app-placeholder': i === 0 && !plainTextOf(block) }"
        :data-placeholder="i === 0 && !plainTextOf(block) ? placeholder : ''"
        v-html="contentToHtml(block.content)"
        @input="onInput(i, $event.currentTarget as HTMLElement)"
        @focus="activeIndex = i"
        @click="activeIndex = i"
        @keydown="onKeydown($event, i)"
      />

      <!-- code block -->
      <pre
        v-else-if="block.type === 'codeBlock'"
        :ref="(el: any) => setBlockEl(i, el)"
        :contenteditable="editable"
        spellcheck="false"
        class="outline-none"
        @input="onInput(i, $event.currentTarget as HTMLElement)"
        @focus="activeIndex = i"
        @click="activeIndex = i"
        @keydown="onKeydown($event, i)"
      ><code v-html="contentToHtml(block.content)"></code></pre>

      <!-- blockquote -->
      <blockquote
        v-else-if="block.type === 'blockquote'"
        :ref="(el: any) => setBlockEl(i, el)"
        :contenteditable="editable"
        spellcheck="false"
        class="outline-none"
        v-html="contentToHtml(block.content)"
        @input="onInput(i, $event.currentTarget as HTMLElement)"
        @focus="activeIndex = i"
        @click="activeIndex = i"
        @keydown="onKeydown($event, i)"
      />

      <!-- bullet / ordered list -->
      <ul
        v-else-if="block.type === 'bulletList'"
        :ref="(el: any) => setBlockEl(i, el)"
        class="outline-none"
        @focus="activeIndex = i"
        @click="activeIndex = i"
      >
        <li
          v-for="(item, j) in block.content ?? []"
          :key="j"
          :contenteditable="editable"
          spellcheck="false"
          class="outline-none"
          v-html="contentToHtml(item.content?.[0]?.content)"
          @input="onListItemInput(i, j, $event.currentTarget as HTMLElement)"
          @focus="activeIndex = i"
          @click="activeIndex = i"
          @keydown="onKeydown($event, i)"
        />
      </ul>
      <ol
        v-else-if="block.type === 'orderedList'"
        :ref="(el: any) => setBlockEl(i, el)"
        class="outline-none"
        @focus="activeIndex = i"
        @click="activeIndex = i"
      >
        <li
          v-for="(item, j) in block.content ?? []"
          :key="j"
          :contenteditable="editable"
          spellcheck="false"
          class="outline-none"
          v-html="contentToHtml(item.content?.[0]?.content)"
          @input="onListItemInput(i, j, $event.currentTarget as HTMLElement)"
          @focus="activeIndex = i"
          @click="activeIndex = i"
          @keydown="onKeydown($event, i)"
        />
      </ol>

      <!-- task list -->
      <ul
        v-else-if="block.type === 'taskList'"
        :ref="(el: any) => setBlockEl(i, el)"
        class="outline-none"
      >
        <li
          v-for="(item, j) in block.content ?? []"
          :key="j"
          class="task-item flex items-start gap-2 outline-none"
        >
          <input
            type="checkbox"
            class="mt-1 accent-(--accent)"
            :checked="!!item.attrs?.checked"
            :disabled="!editable"
            @change="toggleTask(i, j)"
          />
          <span
            :contenteditable="editable"
            spellcheck="false"
            class="flex-1 outline-none"
            v-html="contentToHtml(item.content?.[0]?.content)"
            @input="onListItemInput(i, j, $event.currentTarget as HTMLElement)"
            @focus="activeIndex = i"
            @click="activeIndex = i"
          />
        </li>
      </ul>

      <!-- table -->
      <div
        v-else-if="block.type === 'table'"
        :ref="(el: any) => setBlockEl(i, el)"
        class="overflow-x-auto"
      >
        <table>
          <thead>
            <tr v-for="(row, r) in getTableRows(block).filter((r: any) => r.attrs?.header)" :key="'h' + r">
              <th
                v-for="(cell, c) in row.content ?? []"
                :key="c"
                :contenteditable="editable"
                spellcheck="false"
                class="outline-none"
                v-html="contentToHtml(cell.content?.[0]?.content)"
                @input="onTableCellInput(i, realRowIndexOf(block, row), Number(c), $event.currentTarget as HTMLElement)"
                @focus="activeIndex = i"
                @click="activeIndex = i"
              />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in getTableRows(block).filter((r: any) => !r.attrs?.header)" :key="'b' + r">
              <td
                v-for="(cell, c) in row.content ?? []"
                :key="c"
                :contenteditable="editable"
                spellcheck="false"
                class="outline-none"
                v-html="contentToHtml(cell.content?.[0]?.content)"
                @input="onTableCellInput(i, realRowIndexOf(block, row), Number(c), $event.currentTarget as HTMLElement)"
                @focus="activeIndex = i"
                @click="activeIndex = i"
              />
            </tr>
          </tbody>
        </table>
        <div v-if="editable" class="mt-1 flex gap-1">
          <AppButton size="xs" variant="ghost" @click="setBlock(i, addTableRow(block))">+ row</AppButton>
          <AppButton size="xs" variant="ghost" @click="setBlock(i, addTableCol(block))">+ col</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-placeholder::before {
  content: attr(data-placeholder);
  position: absolute;
  color: var(--fg-muted);
  pointer-events: none;
}
</style>
