export interface ServiceStatus {
  status: 'ok' | 'error' | 'unknown'
  message: string
}

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`)
  }
  return res.json()
}

function ok(message: string): ServiceStatus {
  return { status: 'ok', message }
}

function fail(err: unknown): ServiceStatus {
  return { status: 'error', message: err instanceof Error ? err.message : String(err) }
}

const FORGEJO_BASE = process.env.FORGEJO_BASE ?? 'http://127.0.0.1:3000'

export async function forgejoStatus(): Promise<ServiceStatus> {
  try {
    const data = (await fetchJson(`${FORGEJO_BASE}/api/v1/version`)) as { version?: string }
    return ok(data.version ? `Forgejo ${data.version}` : 'Forgejo reachable')
  } catch (err) {
    return fail(err)
  }
}

const SYNCTHING_BASE = process.env.SYNCTHING_BASE ?? 'http://127.0.0.1:8384'

export async function syncthingStatus(): Promise<ServiceStatus> {
  const key = process.env.SYNCTHING_API_KEY
  if (!key) {
    return { status: 'error', message: 'SYNCTHING_API_KEY not set' }
  }
  try {
    const headers = { 'X-API-Key': key }
    const status = (await fetchJson(`${SYNCTHING_BASE}/rest/system/status`, headers)) as {
      myID?: string
    }
    const myId = status.myID
    const folder = (await fetchJson(
      `${SYNCTHING_BASE}/rest/db/status?folder=notes`,
      headers,
    )) as { localFiles?: number; errors?: number; pullErrors?: number }

    const fileCount = folder.localFiles ?? 0
    const errors = (folder.errors ?? 0) + (folder.pullErrors ?? 0)
    const label = `Syncthing up · ${fileCount} files synced`
    return errors > 0 ? { status: 'error', message: `${label} · ${errors} errors` } : ok(label)
  } catch (err) {
    return fail(err)
  }
}

export function mailStatus(): ServiceStatus {
  return {
    status: 'error',
    message: 'No mail server configured — future phase',
  }
}
