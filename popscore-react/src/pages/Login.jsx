import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import usePage from '../hooks/usePage.js'
import useAuthModal from '../hooks/useAuthModal.js'
import Mascot from '../components/Mascot.jsx'
import PasswordField from '../components/PasswordField.jsx'
import AuthModal from '../components/AuthModal.jsx'

export default function Login() {
  usePage({ title: 'Iniciar sesión', bodyClass: 'auth-page' })

  const { user, login } = useAuth()
  const modal = useAuthModal()
  const location = useLocation()
  const destino = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [eyesClosed, setEyesClosed] = useState(false)
  const [sending, setSending] = useState(false)

  // si ya hay sesion no tiene sentido ver el login (tambien cubre el login recien hecho)
  if (user) return <Navigate to={destino} replace />

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await login(form)
    } catch {
      modal.show(
        'El correo electrónico o la contraseña ingresados no son correctos. Por favor, verificalos e intentalo de nuevo.',
        'Credenciales incorrectas',
        'Reintentar'
      )
      setSending(false)
    }
  }

  return (
    <>
      <main className="wrap">
        {/* tarjeta a la izquierda */}
        <div className="login-card">
          <h1>Iniciar sesión</h1>
          <p className="subtitle">Ingresá tus datos para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Mail@gmail.com"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </div>

            <PasswordField
              id="password"
              label="Contraseña"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={form.password}
              onChange={(v) => set('password', v)}
              onEyesChange={setEyesClosed}
            />

            <div className="row-between">
              <label className="remember">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={form.remember}
                  onChange={(e) => set('remember', e.target.checked)}
                />
                Recordarme
              </label>
              {/* TODO: link real */}
              <a href="#" className="link" onClick={(e) => e.preventDefault()}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="btn-primary" disabled={sending}>
              Iniciar sesión
            </button>
          </form>

          <p className="signup">
            ¿No tenés cuenta? <Link to="/register" className="link">Registrate</Link>
          </p>
        </div>

        {/* mascota a la derecha */}
        <Mascot eyesClosed={eyesClosed} />
      </main>

      <AuthModal data={modal.data} onClose={modal.close} />
    </>
  )
}
