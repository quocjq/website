import { setAuthCookie } from '../utils/auth'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)

  if (!body?.password || body.password !== (process.env.ADMIN_PASSWORD || 'changeme')) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
  }

  setAuthCookie(event)
  return { authed: true }
})
