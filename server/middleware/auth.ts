import { isAuthed } from '../utils/auth'
import { createError } from 'h3'

const PROTECTED_PREFIXES = ['/api/notes', '/api/docs']

export default defineEventHandler((event) => {
  const path = event.path || getRequestURL(event).pathname
  const protectedPath = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))
  if (protectedPath && !isAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
