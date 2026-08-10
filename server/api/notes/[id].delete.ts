import { removeNote, assertNoteId } from '../../utils/notes'

export default defineEventHandler(async (event) => {
  const id = assertNoteId(getRouterParam(event, 'id'))
  try {
    await removeNote(id)
    return { ok: true }
  } catch (error: any) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || 'Note not found' })
  }
})
