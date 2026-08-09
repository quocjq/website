import { isAuthed } from '../utils/auth'

export default defineEventHandler((event) => {
  return { authed: isAuthed(event) }
})
