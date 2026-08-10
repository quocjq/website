export default defineNuxtRouteMiddleware((to) => {
  if (typeof window !== 'undefined') return
  const host = to.path === '/notes' ? null : useRequestHeaders(['host']).host
  const isNoteHost = host?.startsWith('note.') ?? false

  if (isNoteHost && to.path !== '/notes') {
    return navigateTo('/notes', { redirectCode: 302 })
  }
})
