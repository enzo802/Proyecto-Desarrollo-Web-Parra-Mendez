import { useEffect, useRef } from 'react'

const pila = [] // modales abiertos, el ultimo es el de arriba
let bloqueos = 0

export default function Modal({ onClose, extraClass = '', labelledBy, ariaLabel, children }) {
  const idRef = useRef(Symbol('modal'))
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const id = idRef.current
    pila.push(id)
    bloqueos += 1
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape' && pila[pila.length - 1] === id) onCloseRef.current()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      pila.splice(pila.indexOf(id), 1)
      bloqueos -= 1
      if (bloqueos === 0) document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className={`modal-overlay activo ${extraClass}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      onMouseDown={(e) => {
        // solo si el click fue en el fondo oscuro, no en el contenido
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {children}
    </div>
  )
}
