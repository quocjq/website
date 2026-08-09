import { removeDoc, assertDocId } from '../../utils/docs'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = assertDocId(getRouterParam(event, 'id'))

  try {
    await removeDoc(id)
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  return { ok: true }
})
