const peliculasData = [
  {
    id: "la-odisea",
    titulo: "LA ODISEA",
    icono: "🎞️",
    año: "2026",
    genero: "Aventura • Épica • Drama",
    promedioPopScore: "8.4",
    sinopsis: "Una adaptación cinematográfica épica del clásico viaje de Odiseo de regreso a Ítaca tras la caída de Troya, enfrentando dioses, criaturas mitológicas y las pruebas del destino.",
    plataformas: [
      {
        nombre: "Letterboxd",
        puntuacion: "4.2 / 5",
        porcentaje: 84,
        logo: "../images/logo-letterboxd.png",
        consenso: "Gran recepción entre la comunidad cinéfila por su tono oscuro y la profundidad de sus personajes."
      },
      {
        nombre: "IMDb",
        puntuacion: "8.4 / 10",
        porcentaje: 84,
        logo: "../images/logo-imdb.webp",
        consenso: "Aclamada por su despliegue técnico y la dirección de arte en las secuencias míticas."
      },
      {
        nombre: "Rotten Tomatoes",
        puntuacion: "88%",
        porcentaje: 88,
        logo: "../images/logo-rotten-tomatoes.png",
        consenso: "Certificado de frescura. Los críticos destacan el balance entre fidelidad homérica y espectáculo moderno."
      }
      
    ]
  },
  {
    id: "oppenheimer",
    titulo: "OPPENHEIMER",
    icono: "🎞️",
    año: "2023",
    genero: "Biografía • Drama • Historia",
    promedioPopScore: "8.9",
    sinopsis: "La historia del físico teórico J. Robert Oppenheimer y su liderazgo en el Proyecto Manhattan para crear la primera bomba atómica durante la Segunda Guerra Mundial.",
    plataformas: [
      {
        nombre: "IMDb",
        puntuacion: "8.9 / 10",
        porcentaje: 89,
        logo: "../images/logo-imdb.webp",
        consenso: "Ubicada en el Top 100 de las mejores películas de la historia según la votación popular mundial."
      },
      {
        nombre: "Rotten Tomatoes",
        puntuacion: "93%",
        porcentaje: 93,
        logo: "../images/logo-rotten-tomatoes.png",
        consenso: "Triunfo cinematográfico indiscutible impulsado por la magistral actuación protagónica de Cillian Murphy."
      },
      {
        nombre: "Letterboxd",
        puntuacion: "4.5 / 5",
        porcentaje: 90,
        logo: "../images/logo-letterboxd.png",
        consenso: "Elogiada masivamente por el impecable diseño sonoro y el electrizante montaje de Jennifer Lame."
      }
    ]
  },
  {
    id: "spiderman-brand-new-day",
    titulo: "SPIDERMAN: BRAND NEW DAY",
    icono: "🎞️",
    año: "2025",
    genero: "Acción • Superhéroes • Aventura",
    promedioPopScore: "8.0",
    sinopsis: "Peter Parker busca rehacer su vida de forma anónima en una ciudad que olvidó su identidad, enfrentándose a nuevas amenazas callejeras y villanos clásicos.",
    plataformas: [
      {
        nombre: "IMDb",
        puntuacion: "8.0 / 10",
        porcentaje: 80,
        logo: "../images/logo-imdb.webp",
        consenso: "Sólida entrega valorada positivamente por su tono callejero y coreografías de combate cuerpo a cuerpo."
      },
      {
        nombre: "Rotten Tomatoes",
        puntuacion: "85%",
        porcentaje: 85,
        logo: "../images/logo-rotten-tomatoes.png",
        consenso: "Frescura garantizada: el regreso a las raíces del héroe es aplaudido tanto por la crítica como por los fans."
      },
      {
        nombre: "Letterboxd",
        puntuacion: "3.9 / 5",
        porcentaje: 78,
        logo: "../images/logo-letterboxd.png",
        consenso: "Agradable sorpresa dentro del género de superhéroes con secuencias de acción frescas."
      }
    ]
  },
  {
    id: "el-padrino",
    titulo: "EL PADRINO",
    icono: "🎞️",
    año: "1972",
    genero: "Crimen • Drama",
    promedioPopScore: "9.2",
    sinopsis: "El patriarca de una poderosa dinastía del crimen organizado transfiere el control de su imperio clandestino a su reacio y calculador hijo menor.",
    plataformas: [
      {
        nombre: "IMDb",
        puntuacion: "9.2 / 10",
        porcentaje: 92,
        logo: "../images/logo-imdb.webp",
        consenso: "Segunda mejor película de la historia en el ranking Top 250 de IMDb de todos los tiempos."
      },
      {
        nombre: "Rotten Tomatoes",
        puntuacion: "97%",
        porcentaje: 97,
        logo: "../images/logo-rotten-tomatoes.png",
        consenso: "Uno de los mayores logros artísticos y de dirección en la historia del cine mundial."
      },
      {
        nombre: "Letterboxd",
        puntuacion: "4.6 / 5",
        porcentaje: 92,
        logo: "../images/logo-letterboxd.png",
        consenso: "Clásico absoluto reverenciado de forma unánime por todas las generaciones de cinéfilos."
      }
    ]
  },
  {
    id: "una-mente-brillante",
    titulo: "UNA MENTE BRILLANTE",
    icono: "🎞️",
    año: "2001",
    genero: "Biografía • Drama",
    promedioPopScore: "8.2",
    sinopsis: "La vida del brillante matemático John Forbes Nash Jr., ganador del Premio Nobel, desde sus grandes descubrimientos hasta su conmovedora lucha personal contra la esquizofrenia.",
    plataformas: [
      {
        nombre: "IMDb",
        puntuacion: "8.2 / 10",
        porcentaje: 82,
        logo: "../images/logo-imdb.webp",
        consenso: "Ganadora de 4 Premios Óscar incluyendo Mejor Película, Mejor Director y Mejor Guion Adaptado."
      },
      {
        nombre: "Rotten Tomatoes",
        puntuacion: "74% (Crítica) / 93% (Audiencia)",
        porcentaje: 83,
        logo: "../images/logo-rotten-tomatoes.png",
        consenso: "Enorme éxito de audiencia sustentado en el conmovedor trabajo de Russell Crowe y Jennifer Connelly."
      },
      {
        nombre: "Letterboxd",
        puntuacion: "3.9 / 5",
        porcentaje: 78,
        logo: "../images/logo-letterboxd.png",
        consenso: "Retrato sensible e inspirador que continúa conmoviendo al público actual."
      }
    ]
  }
];

// Elementos DOM
const inputBusqueda = document.getElementById("input-busqueda");
const grillaResenas = document.getElementById("grilla-resenas");
const modalOverlay = document.getElementById("modal-resenas");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");

const modalTitulo = document.getElementById("modal-titulo");
const modalPoster = document.getElementById("modal-poster");
const modalPuntuacion = document.getElementById("modal-puntuacion");
const modalMetadatos = document.getElementById("modal-metadatos");
const modalSinopsis = document.getElementById("modal-sinopsis");
const listaPlataformasContenedor = document.getElementById("lista-plataformas");

// Renderizar tarjetas de películas en la grilla principal
function renderizarPeliculas(lista) {
  if (!grillaResenas) return;

  grillaResenas.innerHTML = "";

  if (lista.length === 0) {
    grillaResenas.innerHTML = `
      <div class="sin-resultados">
        <p>🔍 No se encontraron películas que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }

  lista.forEach(pelicula => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-resena";
    tarjeta.setAttribute("tabindex", "0");
    tarjeta.setAttribute("role", "button");
    tarjeta.setAttribute("aria-label", `Ver comparativa de reseñas de ${pelicula.titulo}`);

    // Chips de las 3 plataformas con su logo
    const chipsHTML = pelicula.plataformas
      .map(p => `
        <span class="chip-plataforma">
          <span class="chip-label">
            <img src="${p.logo}" alt="${p.nombre}" class="chip-plataforma-logo">
            ${p.nombre}
          </span>
          <strong>${p.puntuacion}</strong>
        </span>
      `)
      .join("");

    tarjeta.innerHTML = `
      <div class="tarjeta-resena-poster">${pelicula.icono}</div>
      <div class="tarjeta-resena-body">
        <div>
          <h3 class="tarjeta-resena-titulo">${pelicula.titulo}</h3>
          <div class="tarjeta-resena-meta">
            <span class="puntuacion">★ ${pelicula.promedioPopScore} <small style="font-size: 0.75rem; color: var(--khaki-beige);">PopScore</small></span>
            <span class="tarjeta-resena-cant">${pelicula.año}</span>
          </div>
          <div class="resumen-plataformas-chips">
            ${chipsHTML}
          </div>
        </div>
        <button type="button" class="tarjeta-resena-btn">Comparar reseñas</button>
      </div>
    `;

    tarjeta.addEventListener("click", () => abrirModal(pelicula));
    tarjeta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrirModal(pelicula);
      }
    });

    grillaResenas.appendChild(tarjeta);
  });
}

// Búsqueda en tiempo real con JavaScript
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const filtradas = peliculasData.filter(pelicula =>
      pelicula.titulo.toLowerCase().includes(query) ||
      pelicula.genero.toLowerCase().includes(query) ||
      pelicula.sinopsis.toLowerCase().includes(query)
    );
    renderizarPeliculas(filtradas);
  });
}

// Abrir modal de película con la comparativa de plataformas
function abrirModal(pelicula) {
  modalTitulo.textContent = pelicula.titulo;
  modalPoster.textContent = pelicula.icono;
  modalPuntuacion.innerHTML = `★ ${pelicula.promedioPopScore} <span style="font-size: 0.8rem; color: var(--khaki-beige); font-weight: normal;">(Promedio PopScore)</span>`;
  
  if (modalMetadatos) {
    modalMetadatos.textContent = `${pelicula.año} • ${pelicula.genero}`;
  }
  
  modalSinopsis.textContent = pelicula.sinopsis;

  renderizarComparativaPlataformas(pelicula);

  modalOverlay.classList.add("activo");
  document.body.style.overflow = "hidden";
}

// Renderizar la comparativa entre IMDb, Rotten Tomatoes y Letterboxd con sus logos oficiales
function renderizarComparativaPlataformas(pelicula) {
  if (!listaPlataformasContenedor) return;

  listaPlataformasContenedor.innerHTML = "";

  pelicula.plataformas.forEach(plat => {
    const item = document.createElement("div");
    item.className = "card-comparativa-plataforma";

    item.innerHTML = `
      <div class="plataforma-header">
        <div class="plataforma-nombre-wrap">
          <img src="${plat.logo}" alt="${plat.nombre}" class="plataforma-logo">
          <span class="plataforma-nombre">${plat.nombre}</span>
        </div>
        <span class="plataforma-score-badge">${plat.puntuacion}</span>
      </div>

      <div class="barra-progreso-contenedor">
        <div class="barra-progreso-llenado" style="width: ${plat.porcentaje}%;"></div>
      </div>

      <p class="plataforma-consenso"><strong>Consenso crítico:</strong> ${plat.consenso}</p>
    `;

    listaPlataformasContenedor.appendChild(item);
  });
}

// Cerrar modal
function cerrarModal() {
  modalOverlay.classList.remove("activo");
  document.body.style.overflow = "";
}

if (btnCerrarModal) {
  btnCerrarModal.addEventListener("click", cerrarModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      cerrarModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("activo")) {
    cerrarModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderizarPeliculas(peliculasData);
});
