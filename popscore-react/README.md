# PopScore (React)

Version en React de la pagina de resenas (Vite + React Router).

## Como correrlo

1. Copiar la carpeta `images/` del repo original adentro de `public/images/`
   (tiene que quedar `public/images/nombre.png`, `logo-ojos-vacios.png`, `foto_upscaled.jfif`,
   `logo-imdb.webp`, `logo-letterboxd.png`, `logo-rotten-tomatoes.png`, `logo-removebg-preview.png`).
2. `npm install`
3. `npm run dev` y abrir la URL que muestra Vite (normalmente http://localhost:5173).

Las API keys estan en `.env` (no se sube a git). Hay un `.env.example` como modelo.

## Estructura

- `src/pages/`: Login, Register, Inicio, Resenas, Foros, Trivia, Configuracion
  (rutas: `/login`, `/register`, `/`, `/resenas`, `/foros`, `/trivia`, `/configuracion`)
- `src/components/`: Layout + Sidebar, SearchBar, Modal, Mascot, PasswordField, tarjetas y modales de peliculas
- `src/hooks/`: usePage (titulo + clase del body), useMovieSearch (populares + buscador), useAuthModal
- `src/lib/`: auth.js (usuarios y sesion en localStorage), ratings.js (puntajes de las plataformas), foros.js (temas y respuestas)
- `src/data/trivias.js`: las preguntas de la trivia (la primera opcion es siempre la correcta)
- `src/api/tmdb.js`: llamadas a TMDB, OMDb y KinoCheck
- `src/styles/`: los CSS originales

## Foros y trivia

- Foros: temas y respuestas guardados en localStorage.
- Trivia: 10 preguntas generadas con TMDB (director, año de estreno y sinopsis). Si TMDB no responde, se usan las
  preguntas fijas de `src/data/trivias.js`. El mejor puntaje se guarda en el navegador.
- Configuracion: el nombre de usuario y las preferencias se guardan por usuario en localStorage.
- Puntajes: Letterboxd no tiene API, asi que su puntaje es una estimacion a partir de TMDB. IMDb y Rotten Tomatoes
  vienen de OMDb y, si no hay dato, tambien se estiman. En pantalla se marcan como "Estimado".
- Si no llegan a presentarlas, se sacan borrando `Foros.jsx`, `Trivia.jsx`, sus rutas en `App.jsx`,
  los links en `Sidebar.jsx` y los imports de `foros.css` y `trivia.css` en `main.jsx`.
