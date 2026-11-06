const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE = 'https://api.themoviedb.org/3'

// cuadradito violeta para cuando no hay poster
export const PLACEHOLDER_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="#4B4E78"/></svg>'
  )

export const imageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null

async function tmdb(path, params = {}, signal) {
  const qs = new URLSearchParams({ api_key: TMDB_KEY, language: 'es-ES', ...params })
  const resp = await fetch(`${BASE}${path}?${qs}`, { signal })
  if (!resp.ok) throw new Error(`TMDB respondio ${resp.status}`)
  return resp.json()
}

export const getPopular = (signal) => tmdb('/movie/popular', { page: 1 }, signal)

export const searchMovies = (query, signal) => tmdb('/search/movie', { query }, signal)

// detalle + plataformas + videos en una sola llamada (modal de home)
export const getMovieDetail = (id, signal) =>
  tmdb(`/movie/${id}`, { append_to_response: 'watch/providers,videos' }, signal)

// detalle + id de imdb (modal de resenas)
export const getMovieForReviews = (id, signal) =>
  tmdb(`/movie/${id}`, { append_to_response: 'external_ids' }, signal)

// elige un video de youtube: primero Trailer/Teaser, si no el primero que haya
function pickYoutube(results = []) {
  const best = results.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
  if (best) return best.key
  return results[0]?.site === 'YouTube' ? results[0].key : null
}

// trailer: en espanol -> en ingles -> KinoCheck
export async function findTrailerKey(detail, id, signal) {
  let key = pickYoutube(detail.videos?.results)
  if (key) return key

  try {
    const en = await tmdb(`/movie/${id}/videos`, { language: 'en-US' }, signal)
    key = pickYoutube(en.results)
    if (key) return key
  } catch (e) {
    if (e.name === 'AbortError') throw e
  }

  try {
    const resp = await fetch(`https://api.kinocheck.com/movies?tmdb_id=${id}`, { signal })
    const data = await resp.json()
    return data.trailer?.youtube_video_id || null
  } catch (e) {
    if (e.name === 'AbortError') throw e
    return null // si falla simplemente no hay boton
  }
}

// OMDb: por id de imdb y si no hay, por titulo y anio
export async function getOmdb({ imdbId, title, year }, signal) {
  const qs = new URLSearchParams({ apikey: OMDB_KEY })
  if (imdbId) {
    qs.set('i', imdbId)
  } else {
    qs.set('t', title)
    qs.set('y', year)
  }
  try {
    const resp = await fetch(`https://www.omdbapi.com/?${qs}`, { signal })
    const json = await resp.json()
    return json && json.Response === 'True' ? json : null
  } catch (e) {
    if (e.name === 'AbortError') throw e
    console.warn('No se pudo consultar OMDb:', e)
    return null
  }
}
