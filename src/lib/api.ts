import type { ServiceStatus } from './types'

export async function fetchServiceStatus(path: string): Promise<ServiceStatus> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`GET ${path} → ${res.status}`)
  }
  return res.json() as Promise<ServiceStatus>
}
