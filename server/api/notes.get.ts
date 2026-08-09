import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'

const exec = promisify(execFile)
const NOTES_FILE = process.env.NOTES_FILE || '/srv/www/data/notes.txt'

export default defineEventHandler(async () => {
  try {
    const notes = await readFile(NOTES_FILE, 'utf8')
    return { notes }
  } catch (e: any) {
    if (e.code === 'ENOENT') return { notes: '' }
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})
