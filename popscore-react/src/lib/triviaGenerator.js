import { getTopRated, getMovieWithCredits, imageUrl } from '../api/tmdb.js'
import { PREGUNTAS } from '../data/trivias.js'

export const TOTAL = 10
const PAGINAS = [1, 2, 3] // 60 peliculas mejor valoradas, suficiente para variar partidas

export function mezclar(lista) {
    const copia = [...lista]
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[copia[i], copia[j]] = [copia[j], copia[i]]
    }
    return copia
}

const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// 4 opciones (la correcta + 3 distintas) mezcladas; si no hay 3 distractores la pregunta no sirve
function armar(correcta, falsos) {
    const unicos = [...new Set(falsos)].filter((f) => f !== correcta).slice(0, 3)
    return unicos.length === 3 ? mezclar([correcta, ...unicos]) : null
}

// ---------- pool de peliculas (se baja una sola vez) ----------
let cachePool = null

async function obtenerPool(signal) {
    if (cachePool) return cachePool
    const paginas = await Promise.all(PAGINAS.map((p) => getTopRated(p, signal)))
    const vistos = new Set()
    cachePool = paginas
        .flatMap((r) => r.results || [])
        .filter((m) => m.title && m.release_date && !vistos.has(m.id) && vistos.add(m.id))
    return cachePool
}

// ---------- tipo 1: ¿en que año se estreno? ----------
function preguntaAnio(m) {
    const real = Number(m.release_date.slice(0, 4))
    const actual = new Date().getFullYear()
    const candidatos = []
    for (let d = -6; d <= 6; d++) {
        const y = real + d
        if (d !== 0 && y >= 1900 && y <= actual) candidatos.push(String(y))
    }
    const opciones = armar(String(real), mezclar(candidatos).slice(0, 3))
    if (!opciones) return null
    return {
        pregunta: `¿En qué año se estrenó "${m.title}"?`,
        correcta: String(real),
        opciones,
        poster: imageUrl(m.poster_path, 'w185'),
    }
}

// ---------- tipo 2: ¿de que pelicula es esta sinopsis? ----------
function resumir(texto) {
    if (texto.length <= 260) return texto
    const corte = texto.slice(0, 260)
    const fin = corte.lastIndexOf('. ')
    return fin > 120 ? corte.slice(0, fin + 1) : corte.trimEnd() + '…'
}

// descarta sinopsis cortas o que nombran la pelicula (regalarian la respuesta)
function sinopsisValida(m) {
    if (!m.overview || m.overview.length < 80) return false
    const texto = normalizar(m.overview)
    return ![m.title, m.original_title].some((t) => t && t.length >= 3 && texto.includes(normalizar(t)))
}

function preguntaSinopsis(m, pool) {
    const falsos = mezclar(pool.filter((o) => o.title !== m.title)).slice(0, 3).map((o) => o.title)
    const opciones = armar(m.title, falsos)
    if (!opciones) return null
    return {
        pregunta: '¿De qué película es esta sinopsis?',
        contexto: resumir(m.overview),
        correcta: m.title,
        opciones,
    }
}

// ---------- tipo 3: ¿quien dirigio? (necesita una llamada por pelicula) ----------
async function preguntasDirector(candidatas, cantidad, signal) {
    const detalles = await Promise.all(
        candidatas.map((m) =>
            getMovieWithCredits(m.id, signal).catch((e) => {
                if (e.name === 'AbortError') throw e
                return null // si una falla, se sigue con las demas
            })
        )
    )
    const items = detalles
        .filter(Boolean)
        .map((d) => ({
            titulo: d.title,
            director: d.credits?.crew?.find((c) => c.job === 'Director')?.name,
            poster: imageUrl(d.poster_path, 'w185'),
        }))
        .filter((i) => i.director)
    const directores = [...new Set(items.map((i) => i.director))]

    return items
        .map((i) => {
            const falsos = mezclar(directores.filter((d) => d !== i.director)).slice(0, 3)
            const opciones = armar(i.director, falsos)
            return opciones
                ? { pregunta: `¿Quién dirigió "${i.titulo}"?`, correcta: i.director, opciones, poster: i.poster }
                : null
        })
        .filter(Boolean)
        .slice(0, cantidad)
}

// ---------- partida generada con TMDB: 2 de director + 4 de anio + 4 de sinopsis ----------
export async function generarPartidaTMDB(signal) {
    const pool = await obtenerPool(signal)
    const barajadas = mezclar(pool)

    const paraDirector = barajadas.slice(0, 6) // 6 peliculas para tener directores de sobra como distractores
    const paraAnio = barajadas.slice(6, 10)
    const paraSinopsis = barajadas.slice(10).filter(sinopsisValida).slice(0, 4)

    const deDirector = await preguntasDirector(paraDirector, 2, signal)
    const deAnio = paraAnio.map(preguntaAnio).filter(Boolean)
    const deSinopsis = paraSinopsis.map((m) => preguntaSinopsis(m, pool)).filter(Boolean)

    return mezclar([...deDirector, ...deAnio, ...deSinopsis])
}

// ---------- respaldo: las preguntas escritas a mano (la primera opcion es la correcta) ----------
export const partidaRespaldo = () =>
    mezclar(PREGUNTAS).map((p) => ({
        pregunta: p.pregunta,
        correcta: p.opciones[0],
        opciones: mezclar(p.opciones),
    }))