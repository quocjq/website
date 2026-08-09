import { randomUUID } from 'node:crypto'
import { saveDoc, EMPTY_CONTENT } from '../utils/docs'

export default defineEventHandler(async () => {
  const id = randomUUID()
  return saveDoc(id, EMPTY_CONTENT)
})
