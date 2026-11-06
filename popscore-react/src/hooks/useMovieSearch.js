import { useEffect, useState } from 'react'
import { getPopular, searchMovies } from '../api/tmdb.js'

// populares + buscador con delay. Lo usan Home y Resenas.
export default function useMovieSearch(delay = 300) {
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error

  // espera a que termine de tipear antes de pegarle a la api
  useEffect(() => {
    const t = setTimeout(() => setActiveQuery(query.trim()), delay)
    return () => clearTimeout(t)
  }, [query, delay])

  // vacio -> populares, con texto -> busqueda
  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    const request = activeQuery
      ? searchMovies(activeQuery, controller.signal)
      : getPopular(controller.signal)

    request
      .then((data) => {
        setMovies(data.results || [])
        setStatus('ok')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error('Error al cargar peliculas:', err)
        setStatus('error')
      })

    return () => controller.abort()
  }, [activeQuery])

  // con enter busca al toque, sin esperar el delay
  const searchNow = () => setActiveQuery(query.trim())

  return { query, setQuery, searchNow, movies, status, activeQuery }
}
