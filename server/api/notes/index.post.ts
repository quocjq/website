import { createNote } from '../../utils/notes'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string, folder?: string }>(event)
  return await createNote(body ?? {})
})
