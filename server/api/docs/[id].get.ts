import { readStoredDoc, assertDocId } from '../../utils/docs'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = assertDocId(getRouterParam(event, 'id'))

  try {
    return await readStoredDoc(id)
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }
})
