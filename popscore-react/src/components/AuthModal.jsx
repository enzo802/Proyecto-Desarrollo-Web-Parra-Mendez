import { useEffect } from 'react'

// ventana de error de login/registro. data = { title, message, buttonText, id } o null
export default function AuthModal({ data, onClose }) {
  useEffect(() => {
    if (!data) return
    const anterior = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      anterior?.focus?.()
    }
  }, [data, onClose])

  if (!data) return null

  return (
    // la key reinicia la animacion si se vuelve a mostrar con el modal abierto
    <div
      key={data.id}
      className="modal-auth-overlay activo"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-auth-card" role="alertdialog" aria-modal="true"
        aria-labelledby="auth-modal-title" aria-describedby="auth-modal-msg">
        <button type="button" className="modal-auth-close" aria-label="Cerrar" onClick={onClose}>&times;</button>
        <div className="modal-auth-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="7" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 id="auth-modal-title">{data.title}</h3>
        <p id="auth-modal-msg">{data.message}</p>
        <button type="button" className="btn-primary modal-auth-btn" autoFocus onClick={onClose}>
          {data.buttonText}
        </button>
      </div>
    </div>
  )
}
