const apiKey = '18a4d72e96fbd2a79570696a6606c473';
const urlPopulares = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;
const urlBusquedaBase = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=`;

// Fase 1: Cargar películas populares
async function cargarPeliculas() {
    try {
        const respuesta = await fetch(urlPopulares);
        const datos = await respuesta.json();
        
        mostrarPeliculas(datos.results);
    } catch (error) {
        console.error('Hubo un error al cargar las películas:', error);
    }
}

// Fase 1 y 3: Mostrar películas y hacerlas clickeables para el tráiler
function mostrarPeliculas(peliculas) {
    const contenedor = document.querySelector('.grilla-peliculas');
    contenedor.innerHTML = ''; 

    peliculas.forEach(pelicula => {
        const rutaImagen = pelicula.poster_path 
            ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=Sin+Imagen'; // Por si alguna no tiene póster
        const puntuacion = pelicula.vote_average.toFixed(1);
        
        const peliculaHTML = `
            <div class="tarjeta-pelicula" onclick="verTrailer(${pelicula.id})" style="cursor: pointer; transition: transform 0.2s;">
                <img src="${rutaImagen}" alt="Póster de ${pelicula.title}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
                <h3>${pelicula.title.toUpperCase()}</h3>
                <p class="puntuacion">★ ${puntuacion}</p>
            </div>
        `;
        
        contenedor.innerHTML += peliculaHTML;
    });
}

// Fase 2: Lógica del Buscador
const btnBuscar = document.getElementById('btn-buscar');
const inputBuscar = document.getElementById('input-buscar');

btnBuscar.addEventListener('click', async () => {
    const textoBusqueda = inputBuscar.value;
    
    if (textoBusqueda.trim() === '') return;
    
    try {
        const respuesta = await fetch(urlBusquedaBase + textoBusqueda);
        const datos = await respuesta.json();
        
        mostrarPeliculas(datos.results);
    } catch (error) {
        console.error('Error al buscar la película:', error);
    }
});

// Fase 3: Integración con KinoCheck para mostrar tráiler
async function verTrailer(tmdb_id) {
    try {
        const urlKinoCheck = `https://api.kinocheck.com/movies?tmdb_id=${tmdb_id}`;
        const respuesta = await fetch(urlKinoCheck);
        const datos = await respuesta.json();
        
        if (datos.trailer && datos.trailer.youtube_video_id) {
            const videoId = datos.trailer.youtube_video_id;
            const modal = document.getElementById('modal-trailer');
            const videoContainer = document.getElementById('video-container');
            
            videoContainer.innerHTML = `
                <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            `;
            
            modal.style.display = 'flex';
        } else {
            alert('Lamentablemente no hay tráiler oficial disponible para esta película.');
        }
    } catch (error) {
        console.error('Error al cargar el tráiler con KinoCheck:', error);
    }
}

// Función para cerrar la ventana del tráiler
function cerrarModal() {
    const modal = document.getElementById('modal-trailer');
    const videoContainer = document.getElementById('video-container');
    
    modal.style.display = 'none';
    videoContainer.innerHTML = ''; // Corta el video para que no siga sonando
}

// Ejecutar al iniciar
cargarPeliculas();