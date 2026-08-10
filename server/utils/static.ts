import type { App } from 'h3'
import { defineEventHandler, serveStatic, getRequestURL } from 'h3'
import { existsSync, statSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function registerStaticRoutes(app: App) {
  // Default: dist/ sits next to the built server bundle (index.mjs → ../dist).
  // In the Nix install that's <out>/share/lunatix-website/dist.
  const bundleDir = dirname(fileURLToPath(import.meta.url))
  const dist = resolve(process.env.PUBLIC_DIR ?? resolve(bundleDir, '..', 'dist'))

  const isAssetPath = (pathname: string) =>
    !pathname.startsWith('/api/') &&
    pathname.match(/\.(js|css|ico|png|jpg|jpeg|svg|woff2?|map|txt|xml)$/)

  app.use(
    defineEventHandler(async (event) => {
      const pathname = new URL(getRequestURL(event)).pathname

      if (!isAssetPath(pathname)) {
        const index = resolve(dist, 'index.html')
        if (existsSync(index)) {
          event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return readFileSync(index, 'utf-8')
        }
        return 'lunatix-website: build output not found'
      }

      const served = await serveStatic(event, {
        fallthrough: true,
        getMeta: (id) => {
          const file = resolve(dist, id)
          if (!existsSync(file)) return undefined
          const stat = statSync(file)
          return { type: 'file', size: stat.size, mtime: stat.mtimeMs }
        },
        getContents: (id) => {
          const file = resolve(dist, id)
          if (!existsSync(file)) return undefined
          return readFileSync(file)
        },
      })
      if (served !== false) return served

      const index = resolve(dist, 'index.html')
      if (existsSync(index)) {
        event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8')
        return readFileSync(index, 'utf-8')
      }
      return 'lunatix-website: build output not found'
    }),
  )
}
