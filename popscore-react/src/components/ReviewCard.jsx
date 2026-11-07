import { imageUrl } from '../api/tmdb.js'

// tarjeta de la pagina de reseñas
export default function ReviewCard({ movie, onOpenPoster, onCompare }) {
  const anio = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const score = movie.vote_average || 0
  const tmdbScore = score ? score.toFixed(1) : '0.0'
  // letterboxd es sobre 5, asi que es el puntaje de tmdb dividido 2
  const letterboxdEst = `${score ? (score / 2).toFixed(1) : '0.0'} / 5`
  const posterUrl = imageUrl(movie.poster_path, 'w500')
  const posterGrande = imageUrl(movie.poster_path, 'original')

  const abrirPoster = () => {
    const url = posterGrande || posterUrl
    if (url) onOpenPoster(url, movie.title)
  }

  return (
    <article className="tarjeta-resena">
      <div
        className="tarjeta-resena-poster"
        role="button"
        tabIndex={0}
        title="Hacé clic para ver el póster en tamaño completo"
        aria-label={`Ver póster de ${movie.title}`}
        onClick={abrirPoster}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            abrirPoster()
          }
        }}
      >
        {posterUrl ? (
          <img src={posterUrl} alt={`Póster de ${movie.title}`} loading="lazy" />
        ) : (
          <span>🎞️</span>
        )}
        <span className="poster-zoom-hint">🔍 Ver póster</span>
      </div>

      <div className="tarjeta-resena-body">
        <div>
          <h3 className="tarjeta-resena-titulo">{movie.title}</h3>
          <div className="tarjeta-resena-meta">
            <span className="puntuacion">
              ★ {tmdbScore}{' '}
              <small style={{ fontSize: '0.75rem', color: 'var(--khaki-beige)' }}>PopScore</small>
            </span>
            <span className="tarjeta-resena-cant">{anio}</span>
          </div>

          <div className="resumen-plataformas-chips">
            <span className="chip-plataforma">
              <span className="chip-label">
                <img src="/images/logo-letterboxd.png" alt="Letterboxd" className="chip-plataforma-logo" />
                Letterboxd
              </span>
              <strong>≈ {letterboxdEst}</strong>
            </span>
            <span className="chip-plataforma">
              <span className="chip-label">
                <img src="/images/logo-imdb.webp" alt="IMDb" className="chip-plataforma-logo" />
                IMDb
              </span>
              <strong>≈ {tmdbScore} / 10</strong>
            </span>
            <span className="chip-plataforma">
              <span className="chip-label">
                <img src="/images/logo-rotten-tomatoes.png" alt="Rotten Tomatoes" className="chip-plataforma-logo" />
                Rotten Tomatoes
              </span>
              <strong>≈ {Math.round(score * 10)}%</strong>
            </span>
            <p className="chip-nota">≈ Estimado a partir del puntaje de TMDB</p>
          </div>
        </div>

        <button type="button" className="tarjeta-resena-btn" onClick={() => onCompare(movie.id)}>
          Comparar reseñas
        </button>
      </div>
    </article>
  )
}
