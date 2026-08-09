import { readFile } from 'node:fs/promises'

const FILE = process.env.FINANCE_FILE || '/srv/www/data/finance.json'

export default defineEventHandler(async () => {
  try {
    const raw = await readFile(FILE, 'utf8')
    return JSON.parse(raw)
  } catch (e: any) {
    if (e.code === 'ENOENT') return { entries: [] }
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})
