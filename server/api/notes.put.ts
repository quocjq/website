import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const NOTES_FILE = process.env.NOTES_FILE || '/srv/www/data/notes.txt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const notes = String(body.notes ?? '')
  await mkdir(dirname(NOTES_FILE), { recursive: true })
  await writeFile(NOTES_FILE, notes, 'utf8')
  return { ok: true }
})
