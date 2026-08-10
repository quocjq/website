import { setAuthCookie, adminPassword } from '../utils/auth'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)

  if (!body?.password || body.password !== adminPassword()) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
  }

  setAuthCookie(event)
  return { authed: true }
})
