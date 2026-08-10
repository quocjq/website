import { readNote, assertNoteId } from '../../utils/notes'

export default defineEventHandler(async (event) => {
  const id = assertNoteId(getRouterParam(event, 'id'))
  try {
    return await readNote(id)
  } catch (error: any) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || 'Note not found' })
  }
})
