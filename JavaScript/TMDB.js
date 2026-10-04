const apiKey = '18a4d72e96fbd2a79570696a6606c473';
const urlPopulares = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;
// a esta le falta el texto a buscar, se lo pegamos después
const urlBusquedaBase = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=`;

// para el tráiler: guarda el id del video y si se está viendo o no
let videoTrailerKeyActual = null;
let trailerActivo = false;

// trae las populares
async function cargarPeliculas() {
    try {
        const respuesta = await fetch(urlPopulares);
        const datos = await respuesta.json();
        mostrarPeliculas(datos.results);
    } catch (error) {
        console.error('Hubo un error al cargar las películas:', error);
    }
}

// arma la grilla, cada tarjeta se puede clickear para abrir el modal
function mostrarPeliculas(peliculas) {
    const contenedor = document.querySelector('.grilla-peliculas');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; // limpia lo que había

    // si no hay resultados, avisa
    if (!peliculas || peliculas.length === 0) {
        contenedor.innerHTML = '<p class="sin-proveedores">No se encontraron películas para esta búsqueda.</p>';
        return;
    }

    peliculas.forEach(pelicula => {
        // si no tiene póster usa una imagen de relleno
        const rutaImagen = pelicula.poster_path 
            ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=Sin+Imagen';
        const puntuacion = pelicula.vote_average ? pelicula.vote_average.toFixed(1) : '0.0';
        
        // la tarjeta es un div con role button para que se pueda usar con teclado
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

        // click o enter abren el modal
        tarjeta.addEventListener('click', () => abrirDetallePelicula(pelicula.id));
        tarjeta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') abrirDetallePelicula(pelicula.id);
        });

        contenedor.appendChild(tarjeta);
    });
}

// modal de la película: info, tráiler y dónde verla
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

    // resetea el tráiler de la película anterior
    videoTrailerKeyActual = null;
    trailerActivo = false;
    videoContainer.style.display = 'none';
    videoContainer.innerHTML = '';
    textoBtnTrailer.textContent = 'Ver Tráiler Oficial';
    btnTrailer.style.display = 'none'; // el botón aparece solo si se encuentra un video

    // textos de "cargando" mientras llegan los datos
    modalTitulo.textContent = 'Cargando información...';
    modalMetadatos.textContent = '';
    modalPuntuacion.textContent = '★ --';
    modalSinopsis.textContent = 'Consultando sinopsis y plataformas de reproducción disponibles...';
    // cuadradito violeta de placeholder hasta que cargue el póster
    modalPoster.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="75" height="110" fill="%234B4E78"><rect width="100%" height="100%"/></svg>';
    listaDondeVer.innerHTML = '<p class="sin-proveedores">Buscando servicios y plataformas legales...</p>';

    modal.classList.add('activo');

    try {
        // una sola llamada trae detalles, plataformas y videos
        const urlDetalle = `https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${apiKey}&language=es-ES&append_to_response=watch/providers,videos`;
        const resp = await fetch(urlDetalle);
        const data = await resp.json();

        // datos básicos
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

        // busca el tráiler (de youtube), primero un Trailer o Teaser y si no el primer video que haya
        let videoKey = null;
        if (data.videos && data.videos.results && data.videos.results.length > 0) {
            const trailerOficial = data.videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
            if (trailerOficial) videoKey = trailerOficial.key;
            else if (data.videos.results[0].site === 'YouTube') videoKey = data.videos.results[0].key;
        }

        // plan B: si en español no hay, probar en inglés
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

        // plan C: KinoCheck
        if (!videoKey) {
            try {
                const respKino = await fetch(`https://api.kinocheck.com/movies?tmdb_id=${tmdb_id}`);
                const dataKino = await respKino.json();
                if (dataKino.trailer && dataKino.trailer.youtube_video_id) {
                    videoKey = dataKino.trailer.youtube_video_id;
                }
            } catch (e) {
                // si falla no pasa nada, simplemente no hay botón
            }
        }

        // si se encontró algo, se muestra el botón
        if (videoKey) {
            videoTrailerKeyActual = videoKey;
            btnTrailer.style.display = 'inline-flex';
        }

        // dónde verla (los datos vienen de JustWatch a través de TMDB)
        mostrarProveedoresLegales(data['watch/providers']?.results, listaDondeVer);

    } catch (error) {
        console.error('Error al cargar detalle de película:', error);
        modalSinopsis.textContent = 'Ocurrió un error al cargar la información de la película.';
        listaDondeVer.innerHTML = '<p class="sin-proveedores">No se pudo cargar la información de las plataformas legales.</p>';
    }
}

// plataformas donde se puede ver
function mostrarProveedoresLegales(results, contenedor) {
    contenedor.innerHTML = '';

    if (!results || Object.keys(results).length === 0) {
        contenedor.innerHTML = '<p class="sin-proveedores">No hay información de plataformas de streaming legales registrada para esta película actualmente.</p>';
        return;
    }

    // elige el país en este orden: AR, ES, MX, US, y si no hay ninguno agarra el primero que venga
    const region = results.AR || results.ES || results.MX || results.US || Object.values(results)[0];

    if (!region) {
        contenedor.innerHTML = '<p class="sin-proveedores">No hay opciones de streaming o compra legal registradas para esta región.</p>';
        return;
    }

    // tipos de opciones que devuelve la api y cómo los mostramos
    const categorias = [
        { clave: 'flatrate', titulo: 'Streaming (Suscripción)' },
        { clave: 'rent', titulo: 'Alquiler Digital' },
        { clave: 'buy', titulo: 'Compra Digital' },
        { clave: 'free', titulo: 'Gratuito / Con Anuncios' },
        { clave: 'ads', titulo: 'Con Publicidad' }
    ];

    let hayOpciones = false;

    // una sección por cada tipo que tenga plataformas
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

            // logo + nombre de cada plataforma
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

    // hay país pero ninguna opción
    if (!hayOpciones) {
        contenedor.innerHTML = '<p class="sin-proveedores">Actualmente no está disponible en servicios de streaming o alquiler digital en esta región.</p>';
    }

    // link a justwatch para ver todo
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

// botón del tráiler: mostrar / ocultar
function alternarTrailer() {
    const videoContainer = document.getElementById('contenedor-video-trailer');
    const textoBtnTrailer = document.getElementById('texto-btn-trailer');

    // si no hay video no hace nada
    if (!videoTrailerKeyActual || !videoContainer) return;

    if (!trailerActivo) {
        // el iframe se crea recién acá, por eso no carga solo
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
        // al borrar el iframe también se corta el video
        videoContainer.innerHTML = '';
        videoContainer.style.display = 'none';
        textoBtnTrailer.textContent = 'Ver Tráiler Oficial';
        trailerActivo = false;
    }
}

// cierra el modal
function cerrarModalPelicula() {
    const modal = document.getElementById('modal-pelicula');
    const videoContainer = document.getElementById('contenedor-video-trailer');
    
    if (modal) {
        modal.classList.remove('activo');
    }
    if (videoContainer) {
        videoContainer.innerHTML = ''; // si no se vacía el iframe, el audio sigue sonando
        videoContainer.style.display = 'none';
    }
    trailerActivo = false;
}

// escape o click afuera también cierran
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModalPelicula();
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-pelicula');
    // e.target es el fondo oscuro, no el contenido del modal
    if (modal && e.target === modal) {
        cerrarModalPelicula();
    }
});

// buscador
// agarra el input de home o el de reseñas, el que exista
const inputBuscar = document.getElementById('input-buscar') || document.getElementById('input-busqueda');

if (inputBuscar) {
    let timeoutBusqueda;
    // busca solo mientras se escribe (con un delay chico)
    inputBuscar.addEventListener('input', () => {
        clearTimeout(timeoutBusqueda);
        const textoBusqueda = inputBuscar.value.trim();
        
        timeoutBusqueda = setTimeout(async () => {
            // input vacío -> vuelven las populares
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

    // con enter busca al toque, sin esperar el delay
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

// arranque
document.addEventListener('DOMContentLoaded', () => {
    cargarPeliculas();
});

// esta de acá abajo repite lo de arriba, ver si hace falta
cargarPeliculas();