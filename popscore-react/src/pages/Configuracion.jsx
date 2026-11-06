import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import usePage from '../hooks/usePage.js'

function Toggle({ titulo, descripcion, name, checked, onChange }) {
  return (
    <label className="config-toggle">
      <span>
        <strong>{titulo}</strong>
        <small>{descripcion}</small>
      </span>
      <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(name, e.target.checked)} />
    </label>
  )
}

export default function Configuracion() {
  usePage({ title: 'Configuración | PopScore' })

  const { user } = useAuth()
  const navigate = useNavigate()

  // valores iniciales: los datos del usuario logueado y los toggles por defecto
  const inicial = {
    usuario: user?.name ?? '',
    correo: user?.email ?? '',
    perfilPublico: true,
    spoilers: false,
    idioma: 'es',
    recomendaciones: true,
    notifComunidad: true,
    notifNovedades: false,
  }
  const [form, setForm] = useState(inicial)
  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  // al guardar no se manda nada, solo vuelve al home
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <>
      <div className="header">
        <h1>CONFIGURACIÓN</h1>
      </div>

      <div className="config-page">
        <p className="config-intro">Administrá tu cuenta y personalizá tu experiencia en PopScore.</p>

        <form onSubmit={handleSubmit}>
          {/* cuenta */}
          <section className="config-group" aria-labelledby="cuenta-titulo">
            <h2 id="cuenta-titulo">Cuenta</h2>
            <p className="config-description">Actualizá tus datos personales.</p>
            <div className="config-fields">
              <div className="config-field">
                <label htmlFor="usuario">Nombre de usuario</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  placeholder="Tu nombre de usuario"
                  autoComplete="nickname"
                  value={form.usuario}
                  onChange={(e) => set('usuario', e.target.value)}
                />
              </div>
              <div className="config-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  value={form.correo}
                  onChange={(e) => set('correo', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* privacidad */}
          <section className="config-group" aria-labelledby="privacidad-titulo">
            <h2 id="privacidad-titulo">Privacidad</h2>
            <p className="config-description">Controlá cómo se muestra tu actividad.</p>
            <Toggle name="perfilPublico" checked={form.perfilPublico} onChange={set}
              titulo="Perfil público"
              descripcion="Permitir que otras personas vean tus reseñas y puntuaciones." />
            <Toggle name="spoilers" checked={form.spoilers} onChange={set}
              titulo="Mostrar spoilers"
              descripcion="Mostrar directamente el contenido marcado como spoiler." />
          </section>

          {/* experiencia */}
          <section className="config-group" aria-labelledby="experiencia-titulo">
            <h2 id="experiencia-titulo">Experiencia</h2>
            <p className="config-description">Elegí tus preferencias de uso.</p>
            <div className="config-fields">
              <div className="config-field">
                <label htmlFor="idioma">Idioma</label>
                <select id="idioma" name="idioma" value={form.idioma} onChange={(e) => set('idioma', e.target.value)}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <Toggle name="recomendaciones" checked={form.recomendaciones} onChange={set}
              titulo="Recomendaciones personalizadas"
              descripcion="Usar tus puntuaciones para sugerirte películas." />
          </section>

          {/* notificaciones */}
          <section className="config-group" aria-labelledby="notificaciones-titulo">
            <h2 id="notificaciones-titulo">Notificaciones</h2>
            <p className="config-description">Seleccioná qué novedades querés recibir.</p>
            <Toggle name="notifComunidad" checked={form.notifComunidad} onChange={set}
              titulo="Actividad de la comunidad"
              descripcion="Respuestas a tus reseñas y menciones." />
            <Toggle name="notifNovedades" checked={form.notifNovedades} onChange={set}
              titulo="Novedades y recomendaciones"
              descripcion="Estrenos y contenido destacado de PopScore." />
          </section>

          <div className="config-actions">
            <button type="button" className="config-reset" onClick={() => setForm(inicial)}>
              Restablecer
            </button>
            <button type="submit">Guardar cambios</button>
          </div>
        </form>
      </div>
    </>
  )
}
