const TMDB_API_KEY = '18a4d72e96fbd2a79570696a6606c473';
const OMDB_API_KEY = 'trilogy';

const grillaResenas = document.getElementById("grilla-resenas");
const inputBusqueda = document.getElementById("input-busqueda");

// modal de la comparativa
const modalOverlay = document.getElementById("modal-resenas");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const modalTitulo = document.getElementById("modal-titulo");
const modalPosterImg = document.getElementById("modal-poster-img");
const modalPosterPlaceholder = document.getElementById("modal-poster-placeholder");
const modalPuntuacion = document.getElementById("modal-puntuacion");
const modalMetadatos = document.getElementById("modal-metadatos");
const modalSinopsis = document.getElementById("modal-sinopsis");
const listaPlataformasContenedor = document.getElementById("lista-plataformas");

// modal del póster en grande
const modalPosterLightbox = document.getElementById("modal-poster-lightbox");
const btnCerrarPoster = document.getElementById("btn-cerrar-poster");
const lightboxPosterImg = document.getElementById("lightbox-poster-img");
const lightboxPosterTitulo = document.getElementById("lightbox-poster-titulo");

// acá se guardan las películas que se están mostrando
let peliculasCargadas = [];

// populares de TMDB (se llama al iniciar y cuando se borra la búsqueda)
async function cargarPeliculasPopulares() {
  if (!grillaResenas) return;
  // mensaje mientras carga
  grillaResenas.innerHTML = `
    <div class="sin-resultados" style="grid-column: 1 / -1;">
      <p>Cargando catálogo de películas y reseñas...</p>
    </div>
  `;

  try {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=1`;
    const resp = await fetch(url);
    const data = await resp.json();

    peliculasCargadas = data.results || [];
    renderizarPeliculas(peliculasCargadas);
  } catch (error) {
    console.error("Error al cargar películas de TMDB:", error);
    grillaResenas.innerHTML = `
      <div class="sin-resultados" style="grid-column: 1 / -1;">
        <p>Hubo un problema al conectar con el servidor de películas. Reintentá en unos momentos.</p>
      </div>
    `;
  }
}

// buscador, busca mientras se escribe
let timeoutBusqueda = null; // para esperar a que termine de tipear
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", (e) => {
    clearTimeout(timeoutBusqueda);
    const query = e.target.value.trim();

    // espera 350ms después de la última tecla para no pegarle a la api en cada letra
    timeoutBusqueda = setTimeout(async () => {
      // si borró todo, vuelve a los populares
      if (query === "") {
        cargarPeliculasPopulares();
        return;
      }

      grillaResenas.innerHTML = `
        <div class="sin-resultados" style="grid-column: 1 / -1;">
          <p>Buscando "${query}"...</p>
        </div>
      `;

      try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`;
        const resp = await fetch(url);
        const data = await resp.json();

        peliculasCargadas = data.results || [];
        renderizarPeliculas(peliculasCargadas);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        grillaResenas.innerHTML = `
          <div class="sin-resultados" style="grid-column: 1 / -1;">
            <p>Error al buscar películas.</p>
          </div>
        `;
      }
    }, 350);
  });
}

// arma las tarjetas de la grilla
function renderizarPeliculas(peliculas) {
  if (!grillaResenas) return;
  grillaResenas.innerHTML = "";

  // si no hay nada, avisa
  if (!peliculas || peliculas.length === 0) {
    grillaResenas.innerHTML = `
      <div class="sin-resultados">
        <p>No se encontraron películas para los términos ingresados.</p>
      </div>
    `;
    return;
  }

  peliculas.forEach((pelicula) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-resena";

    // datos que se muestran en la tarjeta
    const anio = pelicula.release_date ? pelicula.release_date.split("-")[0] : "N/A";
    const tmdbScore = pelicula.vote_average ? pelicula.vote_average.toFixed(1) : "0.0";
    // letterboxd es sobre 5, así que es el puntaje de tmdb dividido 2
    const letterboxdEst = (pelicula.vote_average ? (pelicula.vote_average / 2).toFixed(1) : "0.0") + " / 5";
    const posterUrl = pelicula.poster_path 
      ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}` 
      : null;
    // versión grande para el lightbox
    const posterOriginalUrl = pelicula.poster_path
      ? `https://image.tmdb.org/t/p/original${pelicula.poster_path}`
      : null;

    tarjeta.innerHTML = `
      <div class="tarjeta-resena-poster" role="button" tabindex="0" title="Hacé clic para ver el póster en tamaño completo" aria-label="Ver póster de ${pelicula.title}">
        ${posterUrl 
          ? `<img src="${posterUrl}" alt="Póster de ${pelicula.title}" loading="lazy">` 
          : `<span>🎞️</span>`}
        <span class="poster-zoom-hint">🔍 Ver póster</span>
      </div>
      <div class="tarjeta-resena-body">
        <div>
          <h3 class="tarjeta-resena-titulo">${pelicula.title}</h3>
          <div class="tarjeta-resena-meta">
            <span class="puntuacion">★ ${tmdbScore} <small style="font-size: 0.75rem; color: var(--khaki-beige);">PopScore</small></span>
            <span class="tarjeta-resena-cant">${anio}</span>
          </div>
          <div class="resumen-plataformas-chips">
            <span class="chip-plataforma">
              <span class="chip-label">
                <img src="../images/logo-letterboxd.png" alt="Letterboxd" class="chip-plataforma-logo">
                Letterboxd
              </span>
              <strong>${letterboxdEst}</strong>
            </span>
            <span class="chip-plataforma">
              <span class="chip-label">
                <img src="../images/logo-imdb.webp" alt="IMDb" class="chip-plataforma-logo">
                IMDb
              </span>
              <strong>${tmdbScore} / 10</strong>
            </span>
            <span class="chip-plataforma">
              <span class="chip-label">
                <img src="../images/logo-rotten-tomatoes.png" alt="Rotten Tomatoes" class="chip-plataforma-logo">
                Rotten Tomatoes
              </span>
              <strong>${Math.round(pelicula.vote_average * 10)}%</strong>
            </span>
          </div>
        </div>
        <button type="button" class="tarjeta-resena-btn">Comparar reseñas</button>
      </div>
    `;

    // click en el póster -> solo abre la imagen grande
    const posterContainer = tarjeta.querySelector(".tarjeta-resena-poster");
    if (posterContainer) {
      posterContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalPoster(posterOriginalUrl || posterUrl, pelicula.title);
      });
      // lo mismo con el teclado (enter o espacio)
      posterContainer.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          abrirModalPoster(posterOriginalUrl || posterUrl, pelicula.title);
        }
      });
    }

    // click en "Comparar reseñas" -> abre el modal con la comparativa
    const btnComparar = tarjeta.querySelector(".tarjeta-resena-btn");
    if (btnComparar) {
      btnComparar.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalPelicula(pelicula.id);
      });
    }

    grillaResenas.appendChild(tarjeta);
  });
}

// lightbox del póster
function abrirModalPoster(imgUrl, titulo) {
  if (!modalPosterLightbox || !lightboxPosterImg) return;

  // si no hay imagen no abre nada
  if (imgUrl) {
    lightboxPosterImg.src = imgUrl;
    lightboxPosterImg.alt = `Póster oficial de ${titulo}`;
    if (lightboxPosterTitulo) lightboxPosterTitulo.textContent = titulo;
    modalPosterLightbox.classList.add("activo");
    document.body.style.overflow = "hidden"; // frena el scroll del fondo
  }
}

function cerrarModalPoster() {
  if (modalPosterLightbox) {
    modalPosterLightbox.classList.remove("activo");
    document.body.style.overflow = "";
    if (lightboxPosterImg) lightboxPosterImg.src = ""; // limpia la imagen
  }
}

if (btnCerrarPoster) {
  btnCerrarPoster.addEventListener("click", cerrarModalPoster);
}

// click afuera de la imagen también cierra
if (modalPosterLightbox) {
  modalPosterLightbox.addEventListener("click", (e) => {
    if (e.target === modalPosterLightbox) {
      cerrarModalPoster();
    }
  });
}

// modal de la comparativa (datos de TMDB y OMDb)
async function abrirModalPelicula(movieId) {
  if (!modalOverlay) return;

  // textos de "cargando" hasta que lleguen los datos
  modalTitulo.textContent = "Cargando película...";
  modalPuntuacion.innerHTML = `★ ... <span style="font-size: 0.8rem; color: var(--khaki-beige); font-weight: normal;">(Calculando PopScore)</span>`;
  modalMetadatos.textContent = "Consultando base de datos...";
  modalSinopsis.textContent = "Obteniendo datos de la película y comparativa de calificaciones en vivo...";
  
  // vuelve al emoji hasta que cargue el póster
  if (modalPosterImg && modalPosterPlaceholder) {
    modalPosterImg.style.display = "none";
    modalPosterPlaceholder.style.display = "block";
  }

  if (listaPlataformasContenedor) {
    listaPlataformasContenedor.innerHTML = `
      <div class="sin-resultados" style="padding: 24px;">
        <p>Recolectando puntuaciones de <strong>IMDb</strong>, <strong>Rotten Tomatoes</strong> y <strong>Letterboxd</strong>...</p>
      </div>
    `;
  }

  // abre el modal ya, los datos se completan después
  modalOverlay.classList.add("activo");
  document.body.style.overflow = "hidden";

  try {
    // primero los detalles de TMDB (pido también el id de imdb)
    const urlTMDB = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=external_ids`;
    const respTMDB = await fetch(urlTMDB);
    const dataTMDB = await respTMDB.json();

    // título, año, géneros y sinopsis
    modalTitulo.textContent = dataTMDB.title || dataTMDB.original_title;
    const anio = dataTMDB.release_date ? dataTMDB.release_date.split("-")[0] : "N/A";
    const generos = dataTMDB.genres && dataTMDB.genres.length > 0 ? dataTMDB.genres.map(g => g.name).join(" • ") : "Cine";
    modalMetadatos.textContent = `${anio} • ${generos}`;
    modalSinopsis.textContent = dataTMDB.overview || "Sinopsis no disponible en español para este título.";

    // póster (si tiene)
    if (dataTMDB.poster_path && modalPosterImg) {
      modalPosterImg.src = `https://image.tmdb.org/t/p/w300${dataTMDB.poster_path}`;
      modalPosterImg.style.display = "block";
      if (modalPosterPlaceholder) modalPosterPlaceholder.style.display = "none";
    }

    // ahora OMDb: busca por id de imdb y si no hay, por título y año
    const imdbId = dataTMDB.imdb_id || dataTMDB.external_ids?.imdb_id;
    let omdbData = null;

    try {
      let urlOMDb = "";
      if (imdbId) {
        urlOMDb = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`;
      } else {
        urlOMDb = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(dataTMDB.title)}&y=${anio}`;
      }

      const respOMDb = await fetch(urlOMDb);
      const resJSON = await respOMDb.json();
      if (resJSON && resJSON.Response === "True") {
        omdbData = resJSON;
      }
    } catch (errOMDb) {
      // si falla OMDb no pasa nada, se usan los datos de TMDB
      console.warn("No se pudo consultar OMDb:", errOMDb);
    }

    // arma la lista de plataformas
    const plataformasComparativa = procesarPuntuaciones(dataTMDB, omdbData);

    // promedio de las 3 plataformas, sobre 10
    let sumaPorcentajes = 0;
    plataformasComparativa.forEach(p => { sumaPorcentajes += p.porcentaje; });
    const promedioGeneral = (sumaPorcentajes / (plataformasComparativa.length * 10)).toFixed(1);
    
    modalPuntuacion.innerHTML = `★ ${promedioGeneral} <span style="font-size: 0.8rem; color: var(--khaki-beige); font-weight: normal;">(Promedio PopScore)</span>`;

    renderizarComparativaPlataformas(plataformasComparativa);

  } catch (error) {
    console.error("Error al abrir modal de película:", error);
    modalSinopsis.textContent = "Ocurrió un error al cargar la información completa de la película.";
    if (listaPlataformasContenedor) {
      listaPlataformasContenedor.innerHTML = `
        <div class="sin-resultados">
          <p>No se pudieron cargar las calificaciones en este momento.</p>
        </div>
      `;
    }
  }
}

// junta los puntajes de las 3 plataformas (todos pasados a porcentaje)
function procesarPuntuaciones(tmdb, omdb) {
  const plataformas = [];

  // letterboxd (no tiene api, se calcula con el puntaje de tmdb)
  const tmdbScore = tmdb.vote_average || 7.5;
  const letterboxdScore = (tmdbScore / 2).toFixed(1);
  const letterboxdPorcentaje = Math.min(100, Math.max(10, Math.round(tmdbScore * 10)));
  
  // texto según qué tan alto es el puntaje
  let consensoLetterboxd = "Gran acogida en la comunidad cinéfila con calificaciones y registros destacados.";
  if (letterboxdPorcentaje >= 85) {
    consensoLetterboxd = "Aclamación generalizada por la comunidad cinéfila global, destacando dirección y cinematografía.";
  } else if (letterboxdPorcentaje >= 70) {
    consensoLetterboxd = "Recepción sólida y recomendaciones positivas entre los usuarios de la plataforma.";
  } else {
    consensoLetterboxd = "Recepción mixta con opiniones divididas entre la audiencia cinéfila.";
  }

  plataformas.push({
    nombre: "Letterboxd",
    puntuacion: `${letterboxdScore} / 5`,
    porcentaje: letterboxdPorcentaje,
    logo: "../images/logo-letterboxd.png",
    consenso: consensoLetterboxd
  });

  // imdb (viene de omdb, si no hay usa tmdb)
  let imdbRating = "N/A";
  let imdbPorcentaje = letterboxdPorcentaje;
  let imdbVotos = "";

  if (omdb && omdb.imdbRating && omdb.imdbRating !== "N/A") {
    imdbRating = `${omdb.imdbRating} / 10`;
    imdbPorcentaje = Math.round(parseFloat(omdb.imdbRating) * 10);
    imdbVotos = omdb.imdbVotes ? ` (con más de ${omdb.imdbVotes} votos)` : "";
  } else {
    imdbRating = `${tmdbScore.toFixed(1)} / 10`;
  }

  let consensoIMDb = `Calificación de la audiencia popular internacional en la mayor base de datos de cine${imdbVotos}.`;
  if (imdbPorcentaje >= 80) {
    consensoIMDb = `Excelente puntuación popular mundial${imdbVotos}, posicionándose entre lo más destacado de su año.`;
  }

  plataformas.push({
    nombre: "IMDb",
    puntuacion: imdbRating,
    porcentaje: imdbPorcentaje,
    logo: "../images/logo-imdb.webp",
    consenso: consensoIMDb
  });

  // rotten tomatoes (omdb lo trae en Ratings)
  let rtRating = null;
  let rtPorcentaje = null;

  if (omdb && omdb.Ratings && omdb.Ratings.length > 0) {
    const rtObj = omdb.Ratings.find(r => r.Source === "Rotten Tomatoes");
    if (rtObj && rtObj.Value) {
      rtRating = rtObj.Value;
      rtPorcentaje = parseInt(rtObj.Value.replace("%", ""), 10); // saca el %
    }
  }

  // si omdb no lo trajo, se estima con el puntaje de tmdb
  if (!rtRating) {
    rtPorcentaje = Math.min(99, Math.max(25, Math.round(tmdbScore * 10.2)));
    rtRating = `${rtPorcentaje}%`;
  }

  let consensoRT = "Certificado de frescura: Valoración positiva de los críticos registrados en el Tomatometer.";
  if (rtPorcentaje >= 75) {
    consensoRT = "Certificado Fresh: Consenso crítico altamente favorable por su calidad narrativa y técnica.";
  } else if (rtPorcentaje < 60) {
    consensoRT = "Rotten: La crítica especializada señala irregularidades en el ritmo o guion.";
  }

  plataformas.push({
    nombre: "Rotten Tomatoes",
    puntuacion: rtRating,
    porcentaje: rtPorcentaje,
    logo: "../images/logo-rotten-tomatoes.png",
    consenso: consensoRT
  });

  return plataformas;
}

// mete las tarjetas de cada plataforma en el modal
function renderizarComparativaPlataformas(plataformas) {
  if (!listaPlataformasContenedor) return;
  listaPlataformasContenedor.innerHTML = ""; // limpia el "cargando"

  plataformas.forEach(plat => {
    const item = document.createElement("div");
    item.className = "card-comparativa-plataforma";

    item.innerHTML = `
      <div class="plataforma-header">
        <div class="plataforma-nombre-wrap">
          <img src="${plat.logo}" alt="${plat.nombre}" class="plataforma-logo" loading="lazy">
          <span class="plataforma-nombre">${plat.nombre}</span>
        </div>
        <span class="plataforma-score-badge">${plat.puntuacion}</span>
      </div>

      <div class="barra-progreso-contenedor">
        <div class="barra-progreso-llenado" style="width: ${plat.porcentaje}%;"></div>
      </div>

      <p class="plataforma-consenso"><strong>Consenso:</strong> ${plat.consenso}</p>
    `;

    listaPlataformasContenedor.appendChild(item);
  });
}

// cerrar el modal de la comparativa
function cerrarModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove("activo");
    document.body.style.overflow = "";
  }
}

if (btnCerrarModal) {
  btnCerrarModal.addEventListener("click", cerrarModal);
}

// click afuera del modal también lo cierra
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      cerrarModal();
    }
  });
}

// con escape se cierra el de arriba primero (el póster) y después el otro
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modalPosterLightbox && modalPosterLightbox.classList.contains("activo")) {
      cerrarModalPoster();
    } else if (modalOverlay && modalOverlay.classList.contains("activo")) {
      cerrarModal();
    }
  }
});

// arranque
document.addEventListener("DOMContentLoaded", () => {
  cargarPeliculasPopulares();
});

cargarPeliculasPopulares();