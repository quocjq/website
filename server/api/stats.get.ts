import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'

const exec = promisify(execFile)

async function readStat() {
  const [utime, ...rest] = (await readFile('/proc/stat', 'utf8')).split('\n')[0].trim().split(/\s+/)
  if (utime !== 'cpu') throw new Error('unexpected /proc/stat')
  const [user, nice, system, idle, iowait, irq, softirq, steal] = rest.map(Number)
  const total = user + nice + system + idle + iowait + irq + softirq + steal
  const idleAll = idle + iowait
  return { total, idle: idleAll }
}

export default defineEventHandler(async () => {
  const a = await readStat()
  await new Promise((r) => setTimeout(r, 100))
  const b = await readStat()

  const loadavg = await readFile('/proc/loadavg', 'utf8')
  const mem = await readFile('/proc/meminfo', 'utf8')

  const [l1, l5, l15] = loadavg.trim().split(/\s+/).slice(0, 3).map(Number)
  const memTotal = Number(/MemTotal:\s+(\d+)/.exec(mem)![1])
  const memAvail = Number(/MemAvailable:\s+(\d+)/.exec(mem)![1])

  const disk = await exec('df', ['-B1', '/', '/srv']).then(({ stdout }) =>
    stdout.trim().split('\n').slice(1).map((line) => {
      const [, blocks, used, avail, pct, mnt] = line.split(/\s+/)
      return { mnt, total: Number(blocks), used: Number(used), available: Number(avail), pct }
    }),
  )

  const services = await exec('systemctl', ['is-active', 'forgejo', 'postgresql', 'caddy', 'pihole-ftl'])
    .then(({ stdout }) =>
      stdout.trim().split('\n').map((state, i) => ({
        name: ['forgejo', 'postgresql', 'caddy', 'pihole-ftl'][i],
        state,
        ok: state === 'active',
      })),
    )
    .catch(() => [])

  return {
    cpu: a && b ? { used: Math.round((1 - (b.idle - a.idle) / (b.total - a.total)) * 100) } : null,
    load: [l1, l5, l15],
    memory: {
      total: memTotal * 1024,
      available: memAvail * 1024,
      pct: Math.round((1 - memAvail / memTotal) * 100),
    },
    disk,
    services,
    uptime: await readFile('/proc/uptime', 'utf8').then((s) => Number(s.split(' ')[0])),
  }
})
