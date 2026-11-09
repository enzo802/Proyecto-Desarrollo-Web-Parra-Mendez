// junta los puntajes de las 3 plataformas (todos pasados a porcentaje)
export function buildPlatformRatings(tmdb, omdb) {
  const plataformas = []
  const tmdbScore = tmdb.vote_average || 7.5

  // letterboxd (no tiene api, se calcula con el puntaje de tmdb)
  const letterboxdScore = (tmdbScore / 2).toFixed(1)
  const letterboxdPorcentaje = Math.min(100, Math.max(10, Math.round(tmdbScore * 10)))

  let consensoLetterboxd
  if (letterboxdPorcentaje >= 85) {
    consensoLetterboxd = 'Aclamación generalizada por la comunidad cinéfila global, destacando dirección y cinematografía.'
  } else if (letterboxdPorcentaje >= 70) {
    consensoLetterboxd = 'Recepción sólida y recomendaciones positivas entre los usuarios de la plataforma.'
  } else {
    consensoLetterboxd = 'Recepción mixta con opiniones divididas entre la audiencia cinéfila.'
  }

  plataformas.push({
    nombre: 'Letterboxd',
    puntuacion: `${letterboxdScore} / 5`,
    porcentaje: letterboxdPorcentaje,
    logo: '/images/logo-letterboxd.png',
    consenso: consensoLetterboxd,
    estimado: true,
  })

  // imdb (viene de omdb, si no hay usa tmdb)
  let imdbRating
  let imdbPorcentaje = letterboxdPorcentaje
  let imdbVotos = ''
  let imdbEstimado = true

  if (omdb && omdb.imdbRating && omdb.imdbRating !== 'N/A') {
    imdbRating = `${omdb.imdbRating} / 10`
    imdbPorcentaje = Math.round(parseFloat(omdb.imdbRating) * 10)
    imdbVotos = omdb.imdbVotes ? ` (con más de ${omdb.imdbVotes} votos)` : ''
    imdbEstimado = false
  } else {
    imdbRating = `${tmdbScore.toFixed(1)} / 10`
  }

  let consensoIMDb = `Calificación de la audiencia popular internacional en la mayor base de datos de cine${imdbVotos}.`
  if (imdbPorcentaje >= 80) {
    consensoIMDb = `Excelente puntuación popular mundial${imdbVotos}, posicionándose entre lo más destacado de su año.`
  }

  plataformas.push({
    nombre: 'IMDb',
    puntuacion: imdbRating,
    porcentaje: imdbPorcentaje,
    logo: '/images/logo-imdb.webp',
    consenso: consensoIMDb,
    estimado: imdbEstimado,
  })

  // rotten tomatoes (omdb lo trae en Ratings)
  let rtRating = null
  let rtPorcentaje = null
  let rtEstimado = false

  const rtObj = omdb?.Ratings?.find((r) => r.Source === 'Rotten Tomatoes')
  if (rtObj && rtObj.Value) {
    rtRating = rtObj.Value
    rtPorcentaje = parseInt(rtObj.Value.replace('%', ''), 10)
  }

  // si omdb no lo trajo, se estima con el puntaje de tmdb
  if (!rtRating) {
    rtPorcentaje = Math.min(99, Math.max(25, Math.round(tmdbScore * 10.2)))
    rtRating = `${rtPorcentaje}%`
    rtEstimado = true
  }

  let consensoRT = 'Certificado de frescura: Valoración positiva de los críticos registrados en el Tomatometer.'
  if (rtPorcentaje >= 75) {
    consensoRT = 'Certificado Fresh: Consenso crítico altamente favorable por su calidad narrativa y técnica.'
  } else if (rtPorcentaje < 60) {
    consensoRT = 'Rotten: La crítica especializada señala irregularidades en el ritmo o guion.'
  }

  plataformas.push({
    nombre: 'Rotten Tomatoes',
    puntuacion: rtRating,
    porcentaje: rtPorcentaje,
    logo: '/images/logo-rotten-tomatoes.png',
    consenso: consensoRT,
    estimado: rtEstimado,
  })

  return plataformas
}

// promedio de las plataformas, sobre 10
export function averageScore(plataformas) {
  const suma = plataformas.reduce((acc, p) => acc + p.porcentaje, 0)
  return (suma / (plataformas.length * 10)).toFixed(1)
}
