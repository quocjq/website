<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation
} from 'd3-force'
import AppButton from './AppButton.vue'
import { apiFetch } from '../lib/api'
import type { GraphEdge, GraphNode, NoteGraph, NoteMeta, TocEntry } from '../types'

const props = defineProps<{
  note: { meta: any, html: string, toc: TocEntry[] } | null
  notes: NoteMeta[]
  currentNoteId: string | null
}>()

const emit = defineEmits<{ select: [id: string] }>()

const collapsed = ref(false)
const activeSection = ref('')
const graph = ref<NoteGraph>({ nodes: [], edges: [] })
const showFileEdges = ref(false)
const svgEl = ref<SVGSVGElement | null>(null)

// --- TOC ---
const tocRoots = computed(() => {
  if (!props.note?.toc?.length) return []
  const entries = props.note.toc
  const base = Math.min(...entries.map((e) => e.level))
  return entries.filter((e) => e.level <= base + 1)
})

const tocDeeper = computed(() => {
  if (!props.note?.toc?.length) return false
  const base = Math.min(...props.note.toc.map((e) => e.level))
  return props.note.toc.some((e) => e.level > base + 1)
})

function scrollToSection(slug: string) {
  const el = document.getElementById(slug)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// --- scrollspy ---
let scroller: HTMLElement | null = null
onMounted(() => {
  scroller = document.querySelector('.reader-scroll')
  if (scroller) scroller.addEventListener('scroll', onScroll)
})
function onScroll() {
  if (!props.note?.toc?.length || !scroller) return
  const offset = scroller.scrollTop + 80
  let current = ''
  for (const e of props.note.toc) {
    const el = document.getElementById(e.slug)
    if (el && el.offsetTop <= offset) current = e.slug
  }
  activeSection.value = current
}
watch(() => props.currentNoteId, () => { activeSection.value = '' })

// --- Calendar ---
const days = computed(() => {
  const map = new Map<string, NoteMeta[]>()
  for (const n of props.notes) {
    if (!n.day) continue
    if (!map.has(n.day)) map.set(n.day, [])
    map.get(n.day)!.push(n)
  }
  return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1))
})
const expandedDays = ref(new Set<string>())
function toggleDay(day: string) {
  if (expandedDays.value.has(day)) expandedDays.value.delete(day)
  else expandedDays.value.add(day)
}

// --- Map (d3-force local graph) ---
const localGraph = computed(() => {
  const id = props.currentNoteId
  if (!id) return { nodes: [], edges: [] }
  const all = graph.value
  const connected = new Set<string>([id])
  const keptEdges: GraphEdge[] = []
  for (const e of all.edges) {
    if (e.from === id || e.to === id) {
      connected.add(e.from)
      connected.add(e.to)
      keptEdges.push(e)
    }
  }
  // one hop back: neighbors' neighbors
  const second = new Set(connected)
  for (const e of all.edges) {
    if ((connected.has(e.from) || connected.has(e.to)) && (e.from !== id && e.to !== id)) {
      second.add(e.from)
      second.add(e.to)
      keptEdges.push(e)
    }
  }
  const shown = new Set<string>()
  for (const e of keptEdges) {
    if (!showFileEdges.value && (e.kind === 'file' || e.kind === 'id')) continue
    shown.add(e.from)
    shown.add(e.to)
  }
  if (!showFileEdges.value && !keptEdges.some((e) => e.kind === 'denote' || e.kind === 'id')) {
    // ensure current node still shows when only file edges exist but toggle is off
    shown.add(id)
  }
  const nodes = all.nodes
    .filter((n) => shown.has(n.id) || n.id === id)
    .map((n) => ({ ...n, x: 0, y: 0 }))
  const edges = keptEdges.filter((e) => showFileEdges.value || e.kind === 'denote' || e.kind === 'id')
  return { nodes, edges }
})

function runSimulation() {
  nextTick(() => {
    const svg = svgEl.value
    const { nodes, edges } = localGraph.value
    if (!svg || !nodes.length) return
    const width = svg.clientWidth || 280
    const height = svg.clientHeight || 300

    const sim = forceSimulation(nodes as any)
      .force('link', forceLink(edges as any).id((d: any) => d.id).distance(60).strength(0.5))
      .force('charge', forceManyBody().strength(-150))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide(22))
      .stop()

    for (let i = 0; i < 200; i++) sim.tick()

    // draw edges
    const linkSel = svg.querySelectorAll('line.graph-edge')
    edges.forEach((e: any, i: number) => {
      const line = linkSel[i] as SVGLineElement | undefined
      if (line) {
        line.setAttribute('x1', String(e.source.x))
        line.setAttribute('y1', String(e.source.y))
        line.setAttribute('x2', String(e.target.x))
        line.setAttribute('y2', String(e.target.y))
      }
    })

    // draw nodes + labels
    const nodeSel = svg.querySelectorAll('g.graph-node')
    nodes.forEach((n: any, i: number) => {
      const g = nodeSel[i] as SVGGElement | undefined
      if (!g) return
      const circle = g.querySelector('circle')
      circle?.setAttribute('cx', String(n.x))
      circle?.setAttribute('cy', String(n.y))
      const text = g.querySelector('text')
      if (text) {
        text.setAttribute('x', String(n.x + 12))
        text.setAttribute('y', String(n.y + 4))
      }
    })
  })
}

watch(() => [props.currentNoteId, graph.value, showFileEdges.value], runSimulation)

async function loadGraph() {
  try {
    graph.value = await apiFetch<NoteGraph>('/api/notes/graph')
  } catch {
    /* silent */
  }
}
onMounted(loadGraph)
watch(() => props.currentNoteId, loadGraph)
</script>

<template>
  <div
    class="flex h-full shrink-0 flex-col border-l border-(--border) bg-(--bg) transition-all duration-200"
    :class="collapsed ? 'w-9' : 'w-64'"
  >
    <div class="flex h-14 shrink-0 items-center justify-between px-2">
      <span v-if="!collapsed" class="px-1 text-xs font-semibold uppercase tracking-wider text-(--fg-muted)">Details</span>
      <AppButton
        variant="ghost"
        :icon="collapsed ? 'panel-right-open' : 'panel-right-close'"
        :aria-label="collapsed ? 'Expand details' : 'Collapse details'"
        @click="collapsed = !collapsed"
      />
    </div>

    <template v-if="!collapsed">
      <!-- TOC -->
      <section class="border-b border-(--border) p-3">
        <h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--fg-muted)">Contents</h3>
        <nav v-if="tocRoots.length" class="flex flex-col gap-0.5 text-sm">
          <a
            v-for="e in tocRoots"
            :key="e.slug"
            href="#"
            class="truncate rounded px-1.5 py-0.5 transition-colors hover:bg-(--bg-elevated)"
            :class="[
              activeSection === e.slug ? 'bg-(--bg-elevated) text-(--accent)' : 'text-(--fg)',
              e.level > tocRoots[0].level ? 'pl-5' : ''
            ]"
            @click.prevent="scrollToSection(e.slug)"
          >{{ e.title }}</a>
          <button v-if="tocDeeper" class="text-left text-xs text-(--fg-muted) px-1.5 py-0.5 hover:text-(--accent)">
            … more
          </button>
        </nav>
        <p v-else class="text-xs text-(--fg-muted)">No headings</p>
      </section>

      <!-- Map -->
      <section class="flex min-h-0 flex-1 flex-col border-b border-(--border) p-3">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-[11px] font-semibold uppercase tracking-wider text-(--fg-muted)">Map</h3>
          <button
            type="button"
            class="text-[11px] text-(--fg-muted) hover:text-(--accent)"
            :class="showFileEdges ? 'text-(--accent)' : ''"
            @click="showFileEdges = !showFileEdges"
          >file/id</button>
        </div>
        <div class="relative min-h-0 flex-1 overflow-hidden rounded-md border border-(--border)">
          <svg ref="svgEl" viewBox="0 0 280 300" preserveAspectRatio="xMidYMid meet" class="h-full w-full">
            <defs>
              <marker id="graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--fg-muted)" />
              </marker>
            </defs>
            <line v-for="(e, i) in localGraph.edges" :key="`${e.from}-${e.to}-${i}`" class="graph-edge" stroke="var(--fg-muted)" stroke-width="1" marker-end="url(#graph-arrow)" />
            <g v-for="(n, i) in localGraph.nodes" :key="n.id" class="graph-node cursor-pointer" @click="emit('select', n.id)">
              <circle r="8" fill="var(--bg-elevated)" stroke="var(--accent)" stroke-width="1.5" />
              <text class="pointer-events-none fill-(--fg) text-[10px]" font-family="inherit">{{ n.id === currentNoteId ? '◆' : '·' }}</text>
            </g>
          </svg>
          <div v-if="!localGraph.nodes.length" class="absolute inset-0 flex items-center justify-center text-xs text-(--fg-muted)">No links</div>
        </div>
        <div class="mt-1 flex items-center gap-3 text-[10px] text-(--fg-muted)">
          <span class="flex items-center gap-1"><span class="size-2 rounded-full border border-(--accent)" /> note</span>
          <span>denote links</span>
          <span v-if="showFileEdges">+ file/id</span>
        </div>
      </section>

      <!-- Calendar -->
      <section class="shrink-0 p-3">
        <h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--fg-muted)">Calendar</h3>
        <div v-if="days.length" class="flex flex-col gap-0.5 text-sm">
          <button
            v-for="[day, list] in days"
            :key="day"
            type="button"
            class="flex items-center justify-between rounded px-1.5 py-1 hover:bg-(--bg-elevated)"
            @click="toggleDay(day)"
          >
            <span class="text-(--fg)">{{ day }}</span>
            <span class="text-xs text-(--fg-muted)">{{ list.length }}</span>
          </button>
          <div
            v-for="[day, list] in days"
            v-show="expandedDays.has(day)"
            :key="`x${day}`"
            class="flex flex-col pl-4"
          >
            <button
              v-for="n in list"
              :key="n.id"
              type="button"
              class="truncate rounded px-1.5 py-0.5 text-left text-xs hover:bg-(--bg-elevated)"
              :class="n.id === currentNoteId ? 'text-(--accent)' : 'text-(--fg-muted)'"
              @click="emit('select', n.id)"
            >{{ n.title }}</button>
          </div>
        </div>
        <p v-else class="text-xs text-(--fg-muted)">No dated notes</p>
      </section>
    </template>
  </div>
</template>
