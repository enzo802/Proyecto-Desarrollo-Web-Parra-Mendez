import { useEffect } from 'react'

// pone el titulo de la pestana y una clase en el body mientras la pagina esta montada
// (las clases scopean los CSS: app-page, auth-page, pagina-resenas)
export default function usePage({ title, bodyClass } = {}) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title
    if (bodyClass) document.body.classList.add(bodyClass)
    return () => {
      document.title = prevTitle
      if (bodyClass) document.body.classList.remove(bodyClass)
    }
  }, [title, bodyClass])
}
