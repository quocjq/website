import type { App } from 'h3'
import { defineEventHandler, serveStatic, getRequestURL } from 'h3'
import { existsSync, statSync, readFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIME: Record<string, string> = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.html': 'text/html',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
}

export function registerStaticRoutes(app: App) {
  const bundleDir = dirname(fileURLToPath(import.meta.url))
  // Layouts differ: local dev has dist/ next to dist-server/; the Nix install
  // has dist/ as a sibling of index.mjs. Probe both.
  const candidates = [
    process.env.PUBLIC_DIR,
    resolve(bundleDir, '..', 'dist'), // local: dist-server/../dist
    resolve(bundleDir, 'dist'), // nix: <out>/share/lunatix-website/dist
  ]
  const dist =
    candidates.find((c) => c && existsSync(resolve(c))) ?? resolve(bundleDir, '..', 'dist')

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
          // id is an absolute path like "/assets/foo.js"; resolve() would treat
          // it as root-absolute and ignore dist. Strip the leading slash.
          const file = resolve(dist, id.replace(/^\/+/, ''))
          if (!existsSync(file)) return undefined
          const stat = statSync(file)
          return {
            type: MIME[extname(file)] ?? 'application/octet-stream',
            size: stat.size,
            mtime: stat.mtimeMs,
          }
        },
        getContents: (id) => {
          const file = resolve(dist, id.replace(/^\/+/, ''))
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
