<template>
  <div class="dash">
    <section class="cards">
      <div class="card">
        <h3>CPU</h3>
        <p class="big" :class="stat.cpu?.used > 90 ? 'bad' : 'ok'">{{ stat.cpu?.used ?? '—' }}%</p>
        <p class="sub">load {{ stat.load?.join(' / ') }}</p>
      </div>
      <div class="card">
        <h3>Memory</h3>
        <p class="big">{{ stat.memory?.pct ?? '—' }}%</p>
        <p class="sub">{{ fmt(stat.memory?.used) }} / {{ fmt(stat.memory?.total) }}</p>
      </div>
      <div class="card">
        <h3>Uptime</h3>
        <p class="big">{{ uptime }}</p>
        <p class="sub">{{ services.length }} services</p>
      </div>
      <div class="card">
        <h3>Services</h3>
        <ul class="svc">
          <li v-for="s in services" :key="s" :class="s.ok ? 'ok' : 'bad'">
            {{ s.name }} — {{ s.ok ? 'active' : s.state }}
          </li>
        </ul>
      </div>
    </section>

    <section class="links">
      <a class="link" href="/forgejo/">Forgejo <span>git — GitHub alternative</span></a>
      <a class="link" href="https://dns.lunixose.duckdns.org/">Pi-hole <span>ad blocking &amp; DNS</span></a>
      <a class="link" href="https://dns.lunixose.duckdns.org/admin/">Pi-hole admin <span>filters, blocklists</span></a>
    </section>

    <section class="cols">
      <div class="panel">
        <h3>Notes</h3>
        <textarea v-model="notes" placeholder="Notes…"></textarea>
        <button @click="saveNotes">Save</button>
        <span v-if="savedNotes" class="ok">saved ✓</span>
      </div>
      <div class="panel">
        <h3>Finance</h3>
        <div class="row">
          <input v-model="entry.label" placeholder="label" />
          <input v-model.number="entry.amount" type="number" step="0.01" placeholder="amount" />
          <button @click="addEntry">Add</button>
        </div>
        <table>
          <thead><tr><th>Label</th><th class="r">Amount</th><th></th></tr></thead>
          <tbody>
            <tr v-for="(e, i) in finance" :key="i">
              <td>{{ e.label }}</td>
              <td class="r" :class="e.amount >= 0 ? 'ok' : 'bad'">{{ fmtMoney(e.amount) }}</td>
              <td class="r"><button class="ghost" @click="removeEntry(i)">✕</button></td>
            </tr>
          </tbody>
          <tfoot><tr><td>Balance</td><td class="r" :class="balance >= 0 ? 'ok' : 'bad'">{{ fmtMoney(balance) }}</td><td></td></tr></tfoot>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const stat = ref<any>({})
const notes = ref('')
const savedNotes = ref(false)
const finance = ref<any[]>([])
const entry = ref({ label: '', amount: 0 })

const services = ref<any[]>([])

onMounted(async () => {
  const [s, n, f] = await Promise.all([
    $fetch('/api/stats'),
    $fetch('/api/notes'),
    $fetch('/api/finance'),
  ])
  stat.value = s
  notes.value = n.notes ?? ''
  finance.value = f.entries ?? []
})

const uptime = computed(() => {
  const u = stat.value.uptime ?? 0
  const d = Math.floor(u / 86400), h = Math.floor((u % 86400) / 3600), m = Math.floor((u % 3600) / 60)
  return `${d}d ${h}h ${m}m`
})

const balance = computed(() => finance.value.reduce((a, e) => a + (e.amount ?? 0), 0))

function fmt(bytes: number) {
  if (!bytes) return '—'
  const g = bytes / 1024 ** 3
  return g >= 1 ? `${g.toFixed(1)}G` : `${(bytes / 1024 ** 2).toFixed(0)}M`
}
function fmtMoney(n: number) {
  return (n >= 0 ? '+' : '') + n.toFixed(2)
}
async function saveNotes() {
  await $fetch('/api/notes', { method: 'PUT', body: { notes: notes.value } })
  savedNotes.value = true
  setTimeout(() => (savedNotes.value = false), 1500)
}
async function addEntry() {
  if (!entry.value.label) return
  finance.value.push({ label: entry.value.label, amount: entry.value.amount })
  entry.value = { label: '', amount: 0 }
  await persist()
}
async function removeEntry(i: number) {
  finance.value.splice(i, 1)
  await persist()
}
async function persist() {
  await $fetch('/api/finance', { method: 'PUT', body: { entries: finance.value } })
}
</script>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.card, .panel, .links { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
.card h3, .panel h3 { margin: 0 0 8px; color: var(--mut); font-size: 13px; text-transform: uppercase; letter-spacing: .05em; }
.big { font-size: 28px; font-weight: 700; margin: 0; }
.ok { color: var(--ok); } .bad { color: var(--bad); }
.sub { color: var(--mut); font-size: 12px; margin: 4px 0 0; }
.svc { list-style: none; padding: 0; margin: 0; font-size: 13px; }
.svc li { padding: 2px 0; }
.links { margin-top: 14px; display: flex; flex-direction: column; gap: 4px; }
a.link { color: var(--fg); text-decoration: none; padding: 8px 10px; border-radius: 8px; display: flex; justify-content: space-between; }
a.link:hover { background: var(--bg); }
a.link span { color: var(--mut); font-size: 12px; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
@media (max-width: 800px) { .cols { grid-template-columns: 1fr; } }
textarea { width: 100%; min-height: 200px; background: var(--bg); color: var(--fg); border: 1px solid var(--line); border-radius: 8px; padding: 10px; font: 13px/1.5 ui-monospace, monospace; }
button { background: var(--acc); color: #0b0e14; border: 0; border-radius: 8px; padding: 8px 14px; font-weight: 600; cursor: pointer; margin-top: 8px; }
button.ghost { background: transparent; color: var(--mut); border: 1px solid var(--line); margin: 0; padding: 2px 6px; }
.row { display: flex; gap: 8px; }
input { background: var(--bg); color: var(--fg); border: 1px solid var(--line); border-radius: 8px; padding: 8px; flex: 1; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
th, td { text-align: left; padding: 6px 4px; border-bottom: 1px solid var(--line); }
.r { text-align: right; }
</style>
