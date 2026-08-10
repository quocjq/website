import { readPublicNote, assertNoteId } from '../../utils/notes'

export default defineEventHandler(async (event) => {
  const id = assertNoteId(getRouterParam(event, 'id'))
  const note = await readPublicNote(id)
  if (!note) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
  return note
})
