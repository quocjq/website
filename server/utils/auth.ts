import { createHmac, timingSafeEqual } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { getCookie, setCookie, deleteCookie, type H3Event } from 'h3'

export const AUTH_COOKIE = 'lunatix-auth'

export function adminPassword(): string {
  const file = process.env.ADMIN_PASSWORD_FILE
  if (file) {
    try {
      return readFileSync(file, 'utf8').trim()
    } catch {
      // fall through to env / default
    }
  }
  return process.env.ADMIN_PASSWORD || 'changeme'
}

function sign(value: string): string {
  return createHmac('sha256', adminPassword()).update(value).digest('hex')
}

export function setAuthCookie(event: H3Event) {
  const value = `true.${sign('true')}`
  setCookie(event, AUTH_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, AUTH_COOKIE, { path: '/' })
}

export function isAuthed(event: H3Event): boolean {
  const cookie = getCookie(event, AUTH_COOKIE) || ''
  const [value, signature] = cookie.split('.')

  if (value !== 'true' || !signature) {
    return false
  }

  const expected = Buffer.from(sign('true'))
  const actual = Buffer.from(signature)

  if (expected.length !== actual.length) {
    return false
  }

  return timingSafeEqual(expected, actual)
}
