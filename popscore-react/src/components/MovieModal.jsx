import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import ProvidersList from './ProvidersList.jsx'
import { getMovieDetail, findTrailerKey, imageUrl, PLACEHOLDER_POSTER } from '../api/tmdb.js'

// modal de home: info de la pelicula, trailer y donde verla
export default function MovieModal({ movieId, onClose }) {
  const [state, setState] = useState({ status: 'loading', data: null, trailerKey: null })
  const [mostrarTrailer, setMostrarTrailer] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', data: null, trailerKey: null })
    setMostrarTrailer(false)

    ;(async () => {
      try {
        const data = await getMovieDetail(movieId, controller.signal)
        setState({ status: 'ok', data, trailerKey: null })
        // el trailer puede tardar (plan B y C), por eso se busca aparte
        const key = await findTrailerKey(data, movieId, controller.signal)
        setState((s) => ({ ...s, trailerKey: key }))
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error('Error al cargar detalle de pelicula:', error)
        setState({ status: 'error', data: null, trailerKey: null })
      }
    })()

    return () => controller.abort()
  }, [movieId])

  const { status, data, trailerKey } = state
  const anio = data?.release_date ? data.release_date.split('-')[0] : 'N/A'
  const generos = data?.genres?.length > 0 ? data.genres.map((g) => g.name).join(' • ') : 'Cine'

  let titulo = 'Cargando información...'
  let sinopsis = 'Consultando sinopsis y plataformas de reproducción disponibles...'
  if (status === 'ok') {
    titulo = data.title || data.original_title || 'Película'
    sinopsis = data.overview || 'Sinopsis no disponible en español para este título.'
  } else if (status === 'error') {
    titulo = 'Película'
    sinopsis = 'Ocurrió un error al cargar la información de la película.'
  }

  return (
    <Modal onClose={onClose} labelledBy="modal-titulo">
      <div className="modal-contenido">
        <div className="modal-header">
          <div className="modal-pelicula-info">
            <img
              className="modal-poster-img"
              src={imageUrl(data?.poster_path, 'w300') || PLACEHOLDER_POSTER}
              alt="Póster"
            />
            <div className="modal-titulo-wrap">
              <h2 id="modal-titulo">{titulo}</h2>
              <p className="modal-subtitulo-info">{status === 'ok' ? `${anio} • ${generos}` : ''}</p>
              <p className="puntuacion">
                ★ {status === 'ok' ? (data.vote_average ? data.vote_average.toFixed(1) : '0.0') : '--'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-cerrar" aria-label="Cerrar modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <p className="modal-sinopsis">{sinopsis}</p>

        {/* el boton aparece solo si se encontro un video */}
        {trailerKey && (
          <div className="modal-trailer-seccion">
            <button type="button" className="btn-ver-trailer" onClick={() => setMostrarTrailer((v) => !v)}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{mostrarTrailer ? 'Ocultar Tráiler' : 'Ver Tráiler Oficial'}</span>
            </button>
            {/* el iframe se crea recien al hacer click y se destruye al ocultar o cerrar (corta el audio) */}
            {mostrarTrailer && (
              <div className="contenedor-video-trailer">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  title="Tráiler de la película"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        <section className="seccion-donde-ver">
          <div className="donde-ver-header">
            <h3>DISPONIBLE EN PLATAFORMAS LEGALES</h3>
            <span className="powered-by-justwatch">Vía JustWatch / TMDB</span>
          </div>
          <div className="lista-donde-ver">
            <ProvidersList results={data?.['watch/providers']?.results} status={status} />
          </div>
        </section>
      </div>
    </Modal>
  )
}
