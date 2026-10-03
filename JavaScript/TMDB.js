const apiKey = '18a4d72e96fbd2a79570696a6606c473';
const urlPopulares = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;
const urlBusquedaBase = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=`;

let videoTrailerKeyActual = null;
let trailerActivo = false;

// 1. Cargar películas populares
async function cargarPeliculas() {
    try {
        const respuesta = await fetch(urlPopulares);
        const datos = await respuesta.json();
        mostrarPeliculas(datos.results);
    } catch (error) {
        console.error('Hubo un error al cargar las películas:', error);
    }
}

// 2. Mostrar películas en la grilla y hacerlas clickeables para ver detalles y dónde verlas
function mostrarPeliculas(peliculas) {
    const contenedor = document.querySelector('.grilla-peliculas');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; 

    if (!peliculas || peliculas.length === 0) {
        contenedor.innerHTML = '<p class="sin-proveedores">No se encontraron películas para esta búsqueda.</p>';
        return;
    }

    peliculas.forEach(pelicula => {
        const rutaImagen = pelicula.poster_path 
            ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=Sin+Imagen';
        const puntuacion = pelicula.vote_average ? pelicula.vote_average.toFixed(1) : '0.0';
        
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-pelicula';
        tarjeta.setAttribute('role', 'button');
        tarjeta.setAttribute('tabindex', '0');
        tarjeta.title = `Ver detalles de ${pelicula.title}`;
        tarjeta.innerHTML = `
            <img src="${rutaImagen}" alt="Póster de ${pelicula.title}" style="width: 100%; border-radius: 8px; margin-bottom: 8px; aspect-ratio: 2/3; object-fit: cover;">
            <h3>${pelicula.title.toUpperCase()}</h3>
            <p class="puntuacion">★ ${puntuacion}</p>
        `;

        tarjeta.addEventListener('click', () => abrirDetallePelicula(pelicula.id));
        tarjeta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') abrirDetallePelicula(pelicula.id);
        });

        contenedor.appendChild(tarjeta);
    });
}

// 3. Abrir Modal con detalles de la película, plataformas legales y botón de tráiler
async function abrirDetallePelicula(tmdb_id) {
    const modal = document.getElementById('modal-pelicula');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalPoster = document.getElementById('modal-poster');
    const modalMetadatos = document.getElementById('modal-metadatos');
    const modalPuntuacion = document.getElementById('modal-puntuacion');
    const modalSinopsis = document.getElementById('modal-sinopsis');
    const listaDondeVer = document.getElementById('lista-donde-ver');
    const videoContainer = document.getElementById('contenedor-video-trailer');
    const btnTrailer = document.getElementById('btn-ver-trailer');
    const textoBtnTrailer = document.getElementById('texto-btn-trailer');

    if (!modal) return;

    // Resetear estado del tráiler y modal
    videoTrailerKeyActual = null;
    trailerActivo = false;
    videoContainer.style.display = 'none';
    videoContainer.innerHTML = '';
    textoBtnTrailer.textContent = 'Ver Tráiler Oficial';
    btnTrailer.style.display = 'none';

    // Estado inicial de carga
    modalTitulo.textContent = 'Cargando información...';
    modalMetadatos.textContent = '';
    modalPuntuacion.textContent = '★ --';
    modalSinopsis.textContent = 'Consultando sinopsis y plataformas de reproducción disponibles...';
    modalPoster.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="75" height="110" fill="%234B4E78"><rect width="100%" height="100%"/></svg>';
    listaDondeVer.innerHTML = '<p class="sin-proveedores">Buscando servicios y plataformas legales...</p>';

    modal.classList.add('activo');

    try {
        // Obtenemos detalles + watch providers (JustWatch) + videos de TMDB en una sola llamada
        const urlDetalle = `https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${apiKey}&language=es-ES&append_to_response=watch/providers,videos`;
        const resp = await fetch(urlDetalle);
        const data = await resp.json();

        // 3.1 Datos básicos
        modalTitulo.textContent = data.title || data.original_title || 'Película';
        const anio = data.release_date ? data.release_date.split('-')[0] : 'N/A';
        const generos = data.genres && data.genres.length > 0 ? data.genres.map(g => g.name).join(' • ') : 'Cine';
        modalMetadatos.textContent = `${anio} • ${generos}`;
        modalPuntuacion.textContent = `★ ${data.vote_average ? data.vote_average.toFixed(1) : '0.0'}`;
        modalSinopsis.textContent = data.overview || 'Sinopsis no disponible en español para este título.';

        if (data.poster_path) {
            modalPoster.src = `https://image.tmdb.org/t/p/w300${data.poster_path}`;
        } else {
            modalPoster.src = 'https://via.placeholder.com/300x450?text=Sin+P%C3%B3ster';
        }

        // 3.2 Buscar video para el tráiler
        let videoKey = null;
        if (data.videos && data.videos.results && data.videos.results.length > 0) {
            const trailerOficial = data.videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
            if (trailerOficial) videoKey = trailerOficial.key;
            else if (data.videos.results[0].site === 'YouTube') videoKey = data.videos.results[0].key;
        }

        // Si no hay tráiler en español, intentar buscar videos en inglés como fallback
        if (!videoKey) {
            try {
                const respEn = await fetch(`https://api.themoviedb.org/3/movie/${tmdb_id}/videos?api_key=${apiKey}&language=en-US`);
                const dataEn = await respEn.json();
                if (dataEn.results && dataEn.results.length > 0) {
                    const trailerEn = dataEn.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
                    if (trailerEn) videoKey = trailerEn.key;
                    else if (dataEn.results[0].site === 'YouTube') videoKey = dataEn.results[0].key;
                }
            } catch (e) {
                console.log('Error buscando trailers en inglés:', e);
            }
        }

        // Si aún no encontramos, fallback a KinoCheck
        if (!videoKey) {
            try {
                const respKino = await fetch(`https://api.kinocheck.com/movies?tmdb_id=${tmdb_id}`);
                const dataKino = await respKino.json();
                if (dataKino.trailer && dataKino.trailer.youtube_video_id) {
                    videoKey = dataKino.trailer.youtube_video_id;
                }
            } catch (e) {
                // Ignore fallback error
            }
        }

        if (videoKey) {
            videoTrailerKeyActual = videoKey;
            btnTrailer.style.display = 'inline-flex';
        }

        // 3.3 Procesar proveedores legales de visualización (API JustWatch vía TMDB)
        mostrarProveedoresLegales(data['watch/providers']?.results, listaDondeVer);

    } catch (error) {
        console.error('Error al cargar detalle de película:', error);
        modalSinopsis.textContent = 'Ocurrió un error al cargar la información de la película.';
        listaDondeVer.innerHTML = '<p class="sin-proveedores">No se pudo cargar la información de las plataformas legales.</p>';
    }
}

// 4. Mostrar plataformas legales disponibles
function mostrarProveedoresLegales(results, contenedor) {
    contenedor.innerHTML = '';

    if (!results || Object.keys(results).length === 0) {
        contenedor.innerHTML = '<p class="sin-proveedores">No hay información de plataformas de streaming legales registrada para esta película actualmente.</p>';
        return;
    }

    // Priorizar región: Argentina (AR), España (ES), México (MX), Estados Unidos (US), o la primera disponible
    const region = results.AR || results.ES || results.MX || results.US || Object.values(results)[0];

    if (!region) {
        contenedor.innerHTML = '<p class="sin-proveedores">No hay opciones de streaming o compra legal registradas para esta región.</p>';
        return;
    }

    const categorias = [
        { clave: 'flatrate', titulo: 'Streaming (Suscripción)' },
        { clave: 'rent', titulo: 'Alquiler Digital' },
        { clave: 'buy', titulo: 'Compra Digital' },
        { clave: 'free', titulo: 'Gratuito / Con Anuncios' },
        { clave: 'ads', titulo: 'Con Publicidad' }
    ];

    let hayOpciones = false;

    categorias.forEach(cat => {
        const lista = region[cat.clave];
        if (lista && lista.length > 0) {
            hayOpciones = true;
            const grupoEl = document.createElement('div');
            grupoEl.className = 'grupo-proveedores';

            const tituloEl = document.createElement('span');
            tituloEl.className = 'grupo-proveedores-titulo';
            tituloEl.textContent = cat.titulo;
            grupoEl.appendChild(tituloEl);

            const gridEl = document.createElement('div');
            gridEl.className = 'proveedores-grid';

            lista.forEach(prov => {
                const logoUrl = prov.logo_path 
                    ? `https://image.tmdb.org/t/p/original${prov.logo_path}`
                    : '';

                const cardEl = document.createElement('div');
                cardEl.className = 'proveedor-card';
                cardEl.innerHTML = `
                    ${logoUrl ? `<img src="${logoUrl}" alt="${prov.provider_name}" class="proveedor-logo" loading="lazy">` : ''}
                    <span class="proveedor-nombre">${prov.provider_name}</span>
                `;
                gridEl.appendChild(cardEl);
            });

            grupoEl.appendChild(gridEl);
            contenedor.appendChild(grupoEl);
        }
    });

    if (!hayOpciones) {
        contenedor.innerHTML = '<p class="sin-proveedores">Actualmente no está disponible en servicios de streaming o alquiler digital en esta región.</p>';
    }

    if (region.link) {
        const linkJustWatch = document.createElement('a');
        linkJustWatch.href = region.link;
        linkJustWatch.target = '_blank';
        linkJustWatch.rel = 'noopener noreferrer';
        linkJustWatch.className = 'link-justwatch';
        linkJustWatch.innerHTML = 'Ver todas las opciones de visualización y precios en JustWatch ↗';
        contenedor.appendChild(linkJustWatch);
    }
}

// 5. Alternar / Mostrar tráiler oficial dentro del modal
function alternarTrailer() {
    const videoContainer = document.getElementById('contenedor-video-trailer');
    const textoBtnTrailer = document.getElementById('texto-btn-trailer');

    if (!videoTrailerKeyActual || !videoContainer) return;

    if (!trailerActivo) {
        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoTrailerKeyActual}?autoplay=1&rel=0" 
                title="Tráiler de la película" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        videoContainer.style.display = 'block';
        textoBtnTrailer.textContent = 'Ocultar Tráiler';
        trailerActivo = true;
    } else {
        videoContainer.innerHTML = '';
        videoContainer.style.display = 'none';
        textoBtnTrailer.textContent = 'Ver Tráiler Oficial';
        trailerActivo = false;
    }
}

// 6. Cerrar modal de detalles
function cerrarModalPelicula() {
    const modal = document.getElementById('modal-pelicula');
    const videoContainer = document.getElementById('contenedor-video-trailer');
    
    if (modal) {
        modal.classList.remove('activo');
    }
    if (videoContainer) {
        videoContainer.innerHTML = ''; // Detiene el audio/reproducción
        videoContainer.style.display = 'none';
    }
    trailerActivo = false;
}

// Cerrar con Escape o clic fuera del modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModalPelicula();
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-pelicula');
    if (modal && e.target === modal) {
        cerrarModalPelicula();
    }
});

// 7. Lógica del Buscador en tiempo real
const inputBuscar = document.getElementById('input-buscar') || document.getElementById('input-busqueda');

if (inputBuscar) {
    let timeoutBusqueda;
    inputBuscar.addEventListener('input', () => {
        clearTimeout(timeoutBusqueda);
        const textoBusqueda = inputBuscar.value.trim();
        
        timeoutBusqueda = setTimeout(async () => {
            if (textoBusqueda === '') {
                cargarPeliculas();
                return;
            }
            try {
                const respuesta = await fetch(urlBusquedaBase + encodeURIComponent(textoBusqueda));
                const datos = await respuesta.json();
                mostrarPeliculas(datos.results);
            } catch (error) {
                console.error('Error al buscar la película:', error);
            }
        }, 300);
    });

    inputBuscar.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const textoBusqueda = inputBuscar.value.trim();
            if (textoBusqueda === '') {
                cargarPeliculas();
                return;
            }
            try {
                const respuesta = await fetch(urlBusquedaBase + encodeURIComponent(textoBusqueda));
                const datos = await respuesta.json();
                mostrarPeliculas(datos.results);
            } catch (error) {
                console.error('Error al buscar la película:', error);
            }
        }
    });
}

// 8. Iniciar la carga al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    cargarPeliculas();
});

// También llamar directamente por si el DOM ya está listo
cargarPeliculas();