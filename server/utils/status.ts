import type { App } from 'h3'
import { createRouter, defineEventHandler } from 'h3'

type ServiceStatus = {
  status: 'ok' | 'error' | 'unknown'
  message: string
}

export function defineStatusRoutes(app: App) {
  const router = createRouter()

  router.get(
    '/api/services/:name',
    defineEventHandler((event): ServiceStatus => {
      const name = event.context.params?.name ?? ''
      switch (name) {
        case 'forgejo':
          return { status: 'unknown', message: 'Forgejo widget not wired yet' }
        case 'syncthing':
          return { status: 'unknown', message: 'Syncthing widget not wired yet' }
        case 'mail':
          return {
            status: 'error',
            message: 'No mail server configured',
          }
        default:
          return { status: 'error', message: `Unknown service: ${name}` }
      }
    }),
  )

  app.use(router)
}
