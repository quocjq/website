import { createApp, toNodeListener } from 'h3'
import { createServer } from 'node:http'
import { defineStatusRoutes } from './utils/status'
import { defineNotesRoutes } from './utils/notesRoutes'
import { registerStaticRoutes } from './utils/static'

const app = createApp()

defineStatusRoutes(app)
defineNotesRoutes(app)

registerStaticRoutes(app)

const port = Number(process.env.PORT ?? '3100')
const server = createServer(toNodeListener(app))
server.listen(port, () => {
  console.log(`lunatix-website listening on :${port}`)
})
