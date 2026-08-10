import { saveNote, assertNoteId } from '../../utils/notes'

export default defineEventHandler(async (event) => {
  const id = assertNoteId(getRouterParam(event, 'id'))
  const body = await readBody<{ content?: Record<string, any>, sourceHash?: string, title?: string }>(event)
  try {
    return await saveNote(id, body ?? {})
  } catch (error: any) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || 'Note not found' })
  }
})
