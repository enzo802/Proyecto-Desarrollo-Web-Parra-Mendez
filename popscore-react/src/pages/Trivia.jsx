import { useEffect, useState } from 'react'
import usePage from '../hooks/usePage.js'
import { TOTAL, mezclar, generarPartidaTMDB, partidaRespaldo } from '../lib/triviaGenerator.js'

const BEST_KEY = 'popscore_trivia_mejor'

const leerMejor = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

// intenta armar la partida con TMDB
async function cargarPartida(signal) {
  try {
    const generadas = await generarPartidaTMDB(signal)
    if (generadas.length >= 6) {
      // si salieron menos de 10 se completa con las manuales
      const faltan = TOTAL - generadas.length
      const preguntas = mezclar([...generadas, ...partidaRespaldo().slice(0, Math.max(0, faltan))])
      return { preguntas: preguntas.slice(0, TOTAL), origen: 'tmdb' }
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error
    console.error('No se pudo generar la trivia con TMDB:', error)
  }
  return { preguntas: partidaRespaldo().slice(0, TOTAL), origen: 'respaldo' }
}

export default function Trivia() {
  usePage({ title: 'Trivia | PopScore' })

  const [partida, setPartida] = useState(null) // null mientras se arman las preguntas
  const [origen, setOrigen] = useState('tmdb')
  const [ronda, setRonda] = useState(0) // sube en cada "jugar de nuevo" para volver a generar
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [puntos, setPuntos] = useState(0)
  const [mejor, setMejor] = useState(leerMejor)

  useEffect(() => {
    const controller = new AbortController()
    setPartida(null)
    cargarPartida(controller.signal)
      .then((r) => {
        setPartida(r.preguntas)
        setOrigen(r.origen)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error(error)
      })
    return () => controller.abort()
  }, [ronda])

  const cargando = partida === null
  const terminada = !cargando && indice >= partida.length
  const actual = cargando ? null : partida[indice]

  const responder = (opcion) => {
    if (elegida !== null) return // ya respondio esta pregunta
    setElegida(opcion)
    if (opcion === actual.correcta) setPuntos((p) => p + 1)
  }

  const siguiente = () => {
    const ultima = indice + 1 >= partida.length
    if (ultima && puntos > mejor) {
      setMejor(puntos)
      try {
        localStorage.setItem(BEST_KEY, String(puntos))
      } catch {
        /* sin storage no se guarda el mejor puntaje */
      }
    }
    setElegida(null)
    setIndice((i) => i + 1)
  }

  const reiniciar = () => {
    setIndice(0)
    setElegida(null)
    setPuntos(0)
    setRonda((r) => r + 1)
  }

  return (
    <>
      <div className="header">
        <h1>TRIVIA</h1>
        <span className="trivia-mejor">Mejor puntaje: {mejor} / {TOTAL}</span>
      </div>

      <section className="trivia-caja">
        {cargando ? (
          <p className="trivia-cargando" role="status">Armando tus preguntas...</p>
        ) : terminada ? (
          <div className="trivia-final">
            <h2>¡Terminaste!</h2>
            <div className="trivia-anillo" style={{ '--pct': `${(puntos / partida.length) * 100}%` }}>
              <div className="trivia-anillo-interior">
                <span className="trivia-anillo-num">{puntos}</span>
                <span className="trivia-anillo-total">de {partida.length}</span>
              </div>
            </div>
            <p className="trivia-mensaje">
              {puntos === partida.length
                ? 'Puntaje perfecto. Sabés mucho de cine.'
                : puntos >= partida.length / 2
                  ? 'Muy bien, casi sos un experto.'
                  : 'Seguí mirando películas y probá de nuevo.'}
            </p>
            <button type="button" className="trivia-btn" onClick={reiniciar}>Jugar de nuevo</button>
          </div>
        ) : (
          <>
            {origen === 'respaldo' && (
              <p className="trivia-aviso">
                No se pudo conectar con TMDB, así que se usaron preguntas de respaldo.
              </p>
            )}

            <div className="trivia-progreso" aria-live="polite">
              <span>Pregunta {indice + 1} de {partida.length}</span>
              <span>Puntos: {puntos}</span>
            </div>
            <div className="trivia-barra" aria-hidden="true">
              <div className="trivia-barra-llenado" style={{ width: `${(indice / partida.length) * 100}%` }} />
            </div>

            <div className="trivia-cabecera">
              {actual.poster && <img className="trivia-poster" src={actual.poster} alt="" />}
              <h2 className="trivia-pregunta">{actual.pregunta}</h2>
            </div>
            {actual.contexto && <blockquote className="trivia-contexto">{actual.contexto}</blockquote>}

            <div className="trivia-opciones">
              {actual.opciones.map((opcion) => {
                let estado = ''
                if (elegida !== null) {
                  if (opcion === actual.correcta) estado = ' correcta'
                  else if (opcion === elegida) estado = ' incorrecta'
                }
                return (
                  <button
                    key={opcion}
                    type="button"
                    className={`trivia-opcion${estado}`}
                    disabled={elegida !== null}
                    onClick={() => responder(opcion)}
                  >
                    {opcion}
                  </button>
                )
              })}
            </div>

            {elegida !== null && (
              <div className="trivia-resultado">
                <p>
                  {elegida === actual.correcta
                    ? '¡Correcto!'
                    : `Incorrecto. La respuesta era: ${actual.correcta}`}
                </p>
                <button type="button" className="trivia-btn" onClick={siguiente}>
                  {indice + 1 >= partida.length ? 'Ver resultado' : 'Siguiente'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}