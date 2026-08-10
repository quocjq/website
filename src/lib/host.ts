export function isNoteHost(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.startsWith('note.')
}
