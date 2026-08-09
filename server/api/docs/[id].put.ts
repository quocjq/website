import { saveDoc, assertDocId } from '../../utils/docs'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = assertDocId(getRouterParam(event, 'id'))
  const body = await readBody<{ content?: Record<string, any> }>(event)

  if (!body?.content || typeof body.content !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'content is required' })
  }

  return await saveDoc(id, body.content)
})
