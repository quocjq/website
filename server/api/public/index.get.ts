import { listPublicNotes } from '../../utils/notes'

export default defineEventHandler(async () => {
  return await listPublicNotes()
})
