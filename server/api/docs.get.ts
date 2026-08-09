import { listDocs, ensureDocsDir, getDocsDir } from '../utils/docs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const docs = await listDocs()

  if (docs.length === 0) {
    const welcomeId = 'welcome'
    await ensureDocsDir()
    const doc = {
      id: welcomeId,
      title: 'Welcome',
      updatedAt: new Date().toISOString(),
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Welcome to Lunatix Docs' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Start typing to create notes. Use the toolbar to format text, add tables, task lists and code blocks.' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Type "/" for commands, ":" for emojis and "@" for mentions.' }] }
        ]
      }
    }
    await writeFile(join(getDocsDir(), `${welcomeId}.json`), JSON.stringify(doc, null, 2), 'utf-8')
    docs.push({ id: welcomeId, title: 'Welcome', updatedAt: doc.updatedAt })
  }

  return docs
})
