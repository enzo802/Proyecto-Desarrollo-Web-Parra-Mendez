// temas y respuestas del foro (localStorage)
const KEY = 'popscore_foros'

export function loadThreads() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveThreads(threads) {
  try {
    localStorage.setItem(KEY, JSON.stringify(threads))
  } catch {
    /* sin storage no se guarda */
  }
}

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
