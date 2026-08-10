import { listNotes } from '../../utils/notes'

export default defineEventHandler(async () => {
  return await listNotes()
})
