import { useState } from 'react'
import usePage from '../hooks/usePage.js'
import useMovieSearch from '../hooks/useMovieSearch.js'
import SearchBar from '../components/SearchBar.jsx'
import MovieCard from '../components/MovieCard.jsx'
import MovieModal from '../components/MovieModal.jsx'

export default function Inicio() {
  usePage({ title: 'Inicio | PopScore' })

  const { query, setQuery, searchNow, movies, status } = useMovieSearch(300)
  const [selectedId, setSelectedId] = useState(null)

  return (
    <>
      <div className="header">
        <h1>INICIO</h1>
        <SearchBar id="input-buscar" value={query} onChange={setQuery} onEnter={searchNow} />
      </div>

      <section className="seccion-populares">
        <h2>POPULARES</h2>
        <div className="grilla-peliculas">
          {status === 'error' && (
            <p className="sin-proveedores">Hubo un error al cargar las películas.</p>
          )}
          {status === 'ok' && movies.length === 0 && (
            <p className="sin-proveedores">No se encontraron películas para esta búsqueda.</p>
          )}
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={setSelectedId} />
          ))}
        </div>
      </section>

      {selectedId && <MovieModal movieId={selectedId} onClose={() => setSelectedId(null)} />}
    </>
  )
}
