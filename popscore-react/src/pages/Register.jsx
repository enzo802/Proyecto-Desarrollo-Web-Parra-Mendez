import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import usePage from '../hooks/usePage.js'
import useAuthModal from '../hooks/useAuthModal.js'
import Mascot from '../components/Mascot.jsx'
import PasswordField from '../components/PasswordField.jsx'
import AuthModal from '../components/AuthModal.jsx'

export default function Register() {
  usePage({ title: 'Crear cuenta', bodyClass: 'auth-page' })

  const { user, register } = useAuth()
  const navigate = useNavigate()
  const modal = useAuthModal()
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '' })
  const [eyesClosed, setEyesClosed] = useState(false)
  const [sending, setSending] = useState(false)
  const [creada, setCreada] = useState(false)

  // cuenta creada: mensaje verde y a los 1.5s va al login
  useEffect(() => {
    if (!creada) return
    const t = setTimeout(() => navigate('/login'), 1500)
    return () => clearTimeout(t)
  }, [creada, navigate])

  if (user) return <Navigate to="/" replace />

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = form.name.trim()

    if (!name) return modal.show('Ingresá tu nombre.')
    if (form.password.length < 6) return modal.show('La contraseña debe tener al menos 6 caracteres.')
    if (form.password !== form.password2) return modal.show('Las contraseñas no coinciden.')

    setSending(true)
    try {
      await register({ name, email: form.email, password: form.password })
      setCreada(true)
    } catch (err) {
      modal.show(err.message)
      setSending(false)
    }
  }

  return (
    <>
      <main className="wrap">
        <div className="login-card">
          <h1>Crear cuenta</h1>
          <p className="subtitle">Completá tus datos para registrarte</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tu nombre"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              minLength={6}
              value={form.password}
              onChange={(v) => set('password', v)}
              onEyesChange={setEyesClosed}
            />

            <PasswordField
              id="password2"
              label="Repetir contraseña"
              placeholder="Repetí la contraseña"
              autoComplete="new-password"
              value={form.password2}
              onChange={(v) => set('password2', v)}
              onEyesChange={setEyesClosed}
            />

            <p className={`form-error${creada ? ' exito' : ''}`} role="alert">
              {creada ? 'Cuenta creada con éxito. Redirigiendo al inicio de sesión...' : ''}
            </p>
            <button type="submit" className="btn-primary" disabled={sending}>
              Crear cuenta
            </button>
          </form>

          <p className="signup">
            ¿Ya tenés cuenta? <Link to="/login" className="link">Iniciá sesión</Link>
          </p>
        </div>

        <Mascot eyesClosed={eyesClosed} />
      </main>

      <AuthModal data={modal.data} onClose={modal.close} />
    </>
  )
}
