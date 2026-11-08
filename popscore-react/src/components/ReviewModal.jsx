import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { getMovieForReviews, getOmdb, imageUrl } from '../api/tmdb.js'
import { buildPlatformRatings, averageScore } from '../lib/ratings.js'

const subtitulo = { fontSize: '0.8rem', color: 'var(--khaki-beige)', fontWeight: 'normal' }

// modal de reseñas: comparativa IMDb / Rotten Tomatoes / Letterboxd (datos de TMDB y OMDb)
export default function ReviewModal({ movieId, onClose }) {
  // status: loading -> partial (ya hay datos de TMDB, faltan puntajes) -> ok | error
  const [state, setState] = useState({ status: 'loading', tmdb: null, platforms: [] })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    setState({ status: 'loading', tmdb: null, platforms: [] })

    ;(async () => {
      try {
        const tmdb = await getMovieForReviews(movieId, signal)
        setState({ status: 'partial', tmdb, platforms: [] })

        const anio = tmdb.release_date ? tmdb.release_date.split('-')[0] : 'N/A'
        const omdb = await getOmdb(
          { imdbId: tmdb.imdb_id || tmdb.external_ids?.imdb_id, title: tmdb.title, year: anio },
          signal
        )
        setState({ status: 'ok', tmdb, platforms: buildPlatformRatings(tmdb, omdb) })
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error('Error al abrir modal de pelicula:', error)
        setState({ status: 'error', tmdb: null, platforms: [] })
      }
    })()

    return () => controller.abort()
  }, [movieId])

  const { status, tmdb, platforms } = state
  const posterUrl = imageUrl(tmdb?.poster_path, 'w300')
  const anio = tmdb?.release_date ? tmdb.release_date.split('-')[0] : 'N/A'
  const generos = tmdb?.genres?.length > 0 ? tmdb.genres.map((g) => g.name).join(' • ') : 'Cine'

  let titulo = 'Cargando película...'
  let metadatos = 'Consultando base de datos...'
  let sinopsis = 'Obteniendo datos de la película y comparativa de calificaciones en vivo...'
  if (tmdb) {
    titulo = tmdb.title || tmdb.original_title
    metadatos = `${anio} • ${generos}`
    sinopsis = tmdb.overview || 'Sinopsis no disponible en español para este título.'
  }
  if (status === 'error') {
    sinopsis = 'Ocurrió un error al cargar la información completa de la película.'
  }

  return (
    <Modal onClose={onClose} labelledBy="modal-titulo">
      <div className="modal-contenido">
        <div className="modal-header">
          <div className="modal-pelicula-info">
            {/* si no hay imagen se queda el emoji de placeholder */}
            <div className="modal-poster">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt="Póster"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                />
              ) : (
                <span>🎞️</span>
              )}
            </div>
            <div className="modal-titulo-wrap">
              <h2 id="modal-titulo">{titulo}</h2>
              <p className="modal-subtitulo-info">{metadatos}</p>
              <p className="puntuacion">
                {status === 'ok' ? (
                  <>★ {averageScore(platforms)} <span style={subtitulo}>(Promedio PopScore)</span></>
                ) : (
                  <>★ {status === 'error' ? '0.0' : '...'} <span style={subtitulo}>{status === 'error' ? '' : '(Calculando PopScore)'}</span></>
                )}
              </p>
            </div>
          </div>
          <button type="button" className="modal-cerrar" aria-label="Cerrar modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <p className="modal-sinopsis">{sinopsis}</p>

        <section className="seccion-comparativa">
          <h3>COMPARATIVA DE CRÍTICAS (IMDb, Rotten Tomatoes, Letterboxd)</h3>
          <div className="lista-plataformas">
            {status === 'ok' &&
              platforms.map((plat) => (
                <div className="card-comparativa-plataforma" key={plat.nombre}>
                  <div className="plataforma-header">
                    <div className="plataforma-nombre-wrap">
                      <img src={plat.logo} alt={plat.nombre} className="plataforma-logo" loading="lazy" />
                      <span className="plataforma-nombre">{plat.nombre}</span>
                      {plat.estimado && (
                        <span className="plataforma-estimado" title="Calculado a partir del puntaje de TMDB">
                          Estimado
                        </span>
                      )}
                    </div>
                    <span className="plataforma-score-badge">{plat.puntuacion}</span>
                  </div>
                  <div className="barra-progreso-contenedor">
                    <div className="barra-progreso-llenado" style={{ width: `${plat.porcentaje}%` }}></div>
                  </div>
                  <p className="plataforma-consenso"><strong>Consenso:</strong> {plat.consenso}</p>
                </div>
              ))}

            {(status === 'loading' || status === 'partial') && (
              <div className="sin-resultados" style={{ padding: 24 }}>
                <p>
                  Recolectando puntuaciones de <strong>IMDb</strong>, <strong>Rotten Tomatoes</strong> y{' '}
                  <strong>Letterboxd</strong>...
                </p>
              </div>
            )}

                        {status === 'error' && (
              <div className="sin-resultados">
                <p>No se pudieron cargar las calificaciones en este momento.</p>
              </div>
            )}
          </div>
          {status === 'ok' && platforms.some((p) => p.estimado) && (
            <p className="nota-estimado">
              "Estimado" significa que no hay un dato oficial y se calcula a partir del puntaje de TMDB.
            </p>
          )}
        </section>
      </div>
    </Modal>
  )
}
