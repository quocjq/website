import type { App } from 'h3'
import { createRouter, defineEventHandler } from 'h3'
import { forgejoStatus, syncthingStatus, mailStatus } from './services'
import type { ServiceStatus } from './services'

export function defineStatusRoutes(app: App) {
  const router = createRouter()

  router.get(
    '/api/services/:name',
    defineEventHandler(async (event): Promise<ServiceStatus> => {
      const name = event.context.params?.name ?? ''
      switch (name) {
        case 'forgejo':
          return forgejoStatus()
        case 'syncthing':
          return syncthingStatus()
        case 'mail':
          return mailStatus()
        default:
          return { status: 'error', message: `Unknown service: ${name}` }
      }
    }),
  )

  app.use(router)
}
