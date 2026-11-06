import { useState } from 'react'
import usePage from '../hooks/usePage.js'
import useMovieSearch from '../hooks/useMovieSearch.js'
import SearchBar from '../components/SearchBar.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import ReviewModal from '../components/ReviewModal.jsx'
import PosterLightbox from '../components/PosterLightbox.jsx'

export default function Resenas() {
  usePage({ title: 'PopScore - Reseñas', bodyClass: 'pagina-resenas' })

  const { query, setQuery, movies, status, activeQuery } = useMovieSearch(350)
  const [selectedId, setSelectedId] = useState(null)
  const [poster, setPoster] = useState(null) // { url, title }

  let contenido
  if (status === 'loading') {
    contenido = (
      <div className="sin-resultados">
        <p>{activeQuery ? `Buscando "${activeQuery}"...` : 'Cargando catálogo de películas y reseñas...'}</p>
      </div>
    )
  } else if (status === 'error') {
    contenido = (
      <div className="sin-resultados">
        <p>Hubo un problema al conectar con el servidor de películas. Reintentá en unos momentos.</p>
      </div>
    )
  } else if (movies.length === 0) {
    contenido = (
      <div className="sin-resultados">
        <p>No se encontraron películas para los términos ingresados.</p>
      </div>
    )
  } else {
    contenido = movies.map((movie) => (
      <ReviewCard
        key={movie.id}
        movie={movie}
        onOpenPoster={(url, title) => setPoster({ url, title })}
        onCompare={setSelectedId}
      />
    ))
  }

  return (
    <>
      <div className="header">
        <h1>RESEÑAS</h1>
        <SearchBar id="input-busqueda" value={query} onChange={setQuery} />
      </div>

      <section className="seccion-populares">
        <h2>EXPLORAR PELÍCULAS</h2>
        <div className="grilla-resenas">{contenido}</div>
      </section>

      {selectedId && <ReviewModal movieId={selectedId} onClose={() => setSelectedId(null)} />}
      {poster && <PosterLightbox url={poster.url} title={poster.title} onClose={() => setPoster(null)} />}
    </>
  )
}
