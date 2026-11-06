import { useEffect, useRef, useState } from 'react'

// campo de contraseña con ojito. Avisa a la mascota si hay que cerrar los ojos
// (se cierran cuando el campo tiene foco y la contraseña esta oculta)
export default function PasswordField({
  id, label, value, onChange, placeholder, autoComplete, minLength, onEyesChange,
}) {
  const inputRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    onEyesChange?.(focused && !visible)
  }, [focused, visible]) // eslint-disable-line react-hooks/exhaustive-deps

  const alternar = () => {
    setVisible((v) => !v)
    inputRef.current?.focus()
  }

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-wrap">
        <input
          ref={inputRef}
          type={visible ? 'text' : 'password'}
          id={id}
          name={id}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          type="button"
          className="toggle-pass"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          onClick={alternar}
        >
          {/* ojo abierto */}
          <svg className="icon-show" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {/* ojo tachado (el css alterna entre los dos segun aria-pressed) */}
          <svg className="icon-hide" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.9 17.9A10.9 10.9 0 0 1 12 19c-6.4 0-10-7-10-7a18.5 18.5 0 0 1 5-5.7" />
            <path d="M9.9 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2" />
            <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
            <path d="M2 2l20 20" />
          </svg>
        </button>
      </div>
    </div>
  )
}
