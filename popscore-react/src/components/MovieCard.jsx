import { imageUrl, PLACEHOLDER_POSTER } from '../api/tmdb.js'

// tarjeta de la grilla de home. Es un div con role button para que se pueda usar con teclado
export default function MovieCard({ movie, onSelect }) {
  const puntuacion = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'

  return (
    <div
      className="tarjeta-pelicula"
      role="button"
      tabIndex={0}
      title={`Ver detalles de ${movie.title}`}
      onClick={() => onSelect(movie.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(movie.id)
      }}
    >
      <img
        src={imageUrl(movie.poster_path) || PLACEHOLDER_POSTER}
        alt={`Póster de ${movie.title}`}
        style={{ width: '100%', borderRadius: 8, marginBottom: 8, aspectRatio: '2/3', objectFit: 'cover' }}
      />
      <h3>{movie.title.toUpperCase()}</h3>
      <p className="puntuacion">★ {puntuacion}</p>
    </div>
  )
}
