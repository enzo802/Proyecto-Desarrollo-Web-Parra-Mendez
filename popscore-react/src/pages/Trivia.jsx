import { useState } from 'react'
import usePage from '../hooks/usePage.js'
import { PREGUNTAS } from '../data/trivias.js'

const BEST_KEY = 'popscore_trivia_mejor'

const mezclar = (lista) => {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// arma una partida: preguntas en orden random y opciones mezcladas (la correcta se marca antes de mezclar)
const nuevaPartida = () =>
  mezclar(PREGUNTAS).map((p) => ({
    pregunta: p.pregunta,
    correcta: p.opciones[0],
    opciones: mezclar(p.opciones),
  }))

const leerMejor = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

export default function Trivia() {
  usePage({ title: 'Trivia | PopScore' })

  const [partida, setPartida] = useState(nuevaPartida)
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [puntos, setPuntos] = useState(0)
  const [mejor, setMejor] = useState(leerMejor)

  const terminada = indice >= partida.length
  const actual = partida[indice]

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
    setPartida(nuevaPartida())
    setIndice(0)
    setElegida(null)
    setPuntos(0)
  }

  return (
    <>
      <div className="header">
        <h1>TRIVIA</h1>
        <span className="trivia-mejor">Mejor puntaje: {mejor} / {partida.length}</span>
      </div>

      <section className="trivia-caja">
        {terminada ? (
          <div className="trivia-final">
            <h2>¡Terminaste!</h2>
            <p className="trivia-puntaje">{puntos} / {partida.length}</p>
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
            <div className="trivia-progreso" aria-live="polite">
              <span>Pregunta {indice + 1} de {partida.length}</span>
              <span>Puntos: {puntos}</span>
            </div>
            <div className="trivia-barra" aria-hidden="true">
              <div className="trivia-barra-llenado" style={{ width: `${(indice / partida.length) * 100}%` }} />
            </div>

            <h2 className="trivia-pregunta">{actual.pregunta}</h2>

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
