import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import usePage from '../hooks/usePage.js'
import { loadThreads, saveThreads, newId, formatDate } from '../lib/foros.js'

export default function Foros() {
  usePage({ title: 'Foros | PopScore' })

  const { user } = useAuth()
  const [threads, setThreads] = useState(loadThreads)
  const [selectedId, setSelectedId] = useState(null)
  const [creando, setCreando] = useState(false)
  const [nuevo, setNuevo] = useState({ title: '', body: '' })
  const [respuesta, setRespuesta] = useState('')

  useEffect(() => {
    saveThreads(threads)
  }, [threads])

  const seleccionado = threads.find((t) => t.id === selectedId)

  const crearTema = (e) => {
    e.preventDefault()
    const title = nuevo.title.trim()
    const body = nuevo.body.trim()
    if (!title || !body) return

    const tema = {
      id: newId(),
      title,
      body,
      author: user.name,
      createdAt: new Date().toISOString(),
      replies: [],
    }
    setThreads((ts) => [tema, ...ts])
    setNuevo({ title: '', body: '' })
    setCreando(false)
    setSelectedId(tema.id)
  }

  const responder = (e) => {
    e.preventDefault()
    const body = respuesta.trim()
    if (!body) return

    const nueva = { id: newId(), body, author: user.name, createdAt: new Date().toISOString() }
    setThreads((ts) =>
      ts.map((t) => (t.id === selectedId ? { ...t, replies: [...t.replies, nueva] } : t))
    )
    setRespuesta('')
  }

  // ---------- vista de un tema ----------
  if (seleccionado) {
    return (
      <>
        <div className="header">
          <h1>FOROS</h1>
        </div>

        <button type="button" className="foro-volver" onClick={() => setSelectedId(null)}>
          ← Volver a los temas
        </button>

        <article className="foro-tema">
          <h2>{seleccionado.title}</h2>
          <p className="foro-meta">
            {seleccionado.author} · {formatDate(seleccionado.createdAt)}
          </p>
          <p className="foro-cuerpo">{seleccionado.body}</p>
        </article>

        <section className="foro-respuestas" aria-label="Respuestas">
          <h3>{seleccionado.replies.length} {seleccionado.replies.length === 1 ? 'respuesta' : 'respuestas'}</h3>
          {seleccionado.replies.map((r) => (
            <div className="foro-respuesta" key={r.id}>
              <p className="foro-meta">{r.author} · {formatDate(r.createdAt)}</p>
              <p className="foro-cuerpo">{r.body}</p>
            </div>
          ))}
        </section>

        <form className="foro-form" onSubmit={responder}>
          <label htmlFor="foro-respuesta">Tu respuesta</label>
          <textarea
            id="foro-respuesta"
            rows={3}
            maxLength={1000}
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Escribí tu respuesta..."
          />
          <button type="submit" className="foro-btn" disabled={!respuesta.trim()}>Responder</button>
        </form>
      </>
    )
  }

  // ---------- lista de temas ----------
  return (
    <>
      <div className="header">
        <h1>FOROS</h1>
        {!creando && (
          <button type="button" className="foro-btn" onClick={() => setCreando(true)}>Nuevo tema</button>
        )}
      </div>

      {creando && (
        <form className="foro-form" onSubmit={crearTema}>
          <label htmlFor="foro-titulo">Título</label>
          <input
            id="foro-titulo"
            type="text"
            maxLength={120}
            value={nuevo.title}
            onChange={(e) => setNuevo((n) => ({ ...n, title: e.target.value }))}
            placeholder="Ej: ¿Cuál es la mejor película de Nolan?"
            required
          />
          <label htmlFor="foro-mensaje">Mensaje</label>
          <textarea
            id="foro-mensaje"
            rows={4}
            maxLength={1000}
            value={nuevo.body}
            onChange={(e) => setNuevo((n) => ({ ...n, body: e.target.value }))}
            placeholder="Contá de qué querés hablar..."
            required
          />
          <div className="foro-acciones">
            <button type="button" className="foro-btn secundario" onClick={() => setCreando(false)}>Cancelar</button>
            <button type="submit" className="foro-btn">Publicar</button>
          </div>
        </form>
      )}

      <section className="seccion-populares">
        <h2>TEMAS</h2>
        {threads.length === 0 ? (
          <p className="sin-resultados" style={{ color: '#ffffff' }}>Todavía no hay temas. ¡Creá el primero!</p>
        ) : (
          <div className="foro-lista">
            {threads.map((t) => (
              <button type="button" className="foro-item" key={t.id} onClick={() => setSelectedId(t.id)}>
                <span className="foro-item-titulo">{t.title}</span>
                <span className="foro-meta">
                  {t.author} · {formatDate(t.createdAt)} · {t.replies.length}{' '}
                  {t.replies.length === 1 ? 'respuesta' : 'respuestas'}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  )
}