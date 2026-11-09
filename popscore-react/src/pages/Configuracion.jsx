import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import usePage from '../hooks/usePage.js'
import Avatar from '../components/Avatar.jsx'
import { loadPrefs, savePrefs } from '../lib/preferencias.js'
import { getAvatar, saveAvatar, removeAvatar, resizeImage } from '../lib/avatar.js'

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

  // esta pagina solo se muestra con sesion (ver RutaProtegida en App.jsx)
  const { user, updateProfile } = useAuth()

  // lo ultimo guardado: el nombre del usuario y sus preferencias
  const [guardado, setGuardado] = useState(() => ({ usuario: user.name, ...loadPrefs(user.email) }))
  const [form, setForm] = useState(guardado)
  const [aviso, setAviso] = useState(false)

  // la foto se guarda apenas se elige (no espera al boton "Guardar cambios")
  const [foto, setFoto] = useState(() => getAvatar(user.email))
  const [errorFoto, setErrorFoto] = useState('')

  const elegirFoto = async (e) => {
    const archivo = e.target.files[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) {
      setErrorFoto('El archivo tiene que ser una imagen.')
      return
    }
    try {
      const dataUrl = await resizeImage(archivo)
      if (!saveAvatar(user.email, dataUrl)) {
        setErrorFoto('No se pudo guardar la foto en el navegador.')
        return
      }
      setFoto(dataUrl)
      setErrorFoto('')
    } catch (err) {
      setErrorFoto(err.message)
    }
  }

  const quitarFoto = () => {
    removeAvatar(user.email)
    setFoto(null)
    setErrorFoto('')
  }

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setAviso(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nombre = form.usuario.trim()
    if (!nombre) return

    const { usuario, ...prefs } = form
    updateProfile(nombre)
    savePrefs(user.email, prefs)

    const nuevo = { ...form, usuario: nombre }
    setGuardado(nuevo)
    setForm(nuevo)
    setAviso(true)
  }

  const restablecer = () => {
    setForm(guardado)
    setAviso(false)
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

            <div className="config-foto">
              <Avatar email={user.email} name={form.usuario} size={72} />
              <div className="config-foto-acciones">
                <label className="config-foto-btn">
                  Cambiar foto
                  <input type="file" accept="image/*" className="config-foto-input" onChange={elegirFoto} />
                </label>
                {foto && (
                  <button type="button" className="config-foto-quitar" onClick={quitarFoto}>
                    Quitar foto
                  </button>
                )}
                {errorFoto && <p className="config-foto-error" role="alert">{errorFoto}</p>}
              </div>
            </div>

            <div className="config-fields">
              <div className="config-field">
                <label htmlFor="usuario">Nombre de usuario</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  placeholder="Tu nombre de usuario"
                  autoComplete="nickname"
                  required
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
                  autoComplete="email"
                  value={user.email}
                  readOnly
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
            {aviso && <p className="config-aviso" role="status">Cambios guardados.</p>}
            <button type="button" className="config-reset" onClick={restablecer}>
              Restablecer
            </button>
            <button type="submit">Guardar cambios</button>
          </div>
        </form>
      </div>
    </>
  )
}