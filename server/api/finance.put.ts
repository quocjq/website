import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const FILE = process.env.FINANCE_FILE || '/srv/www/data/finance.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const entries = Array.isArray(body.entries) ? body.entries : []
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify({ entries }, null, 2), 'utf8')
  return { ok: true }
})
