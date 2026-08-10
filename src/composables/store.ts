import { ref } from 'vue'
import type { NoteMeta } from '../types'

export const authed = ref(false)
export const authLoading = ref(true)
export const notes = ref<NoteMeta[]>([])
export const noteFolders = ref<string[]>([])
export const currentNoteId = ref<string | null>(null)
