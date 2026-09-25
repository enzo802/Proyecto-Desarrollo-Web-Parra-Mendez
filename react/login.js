document.addEventListener('mousemove', (event) => {
  const eyes = document.querySelectorAll('.eye');

  eyes.forEach(eye => {
    const pupil = eye.querySelector('.pupil');
    if (!pupil) return;

    // Obtener las dimensiones y posición del ojo en la pantalla
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    // Calcular la diferencia entre el cursor y el centro del ojo
    const deltaX = event.clientX - eyeCenterX;
    const deltaY = event.clientY - eyeCenterY;

    // Calcular el ángulo y la distancia lineal
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.hypot(deltaX, deltaY);

    // Definir el límite de movimiento para que la pupila no salga del globo ocular
    const maxRadiusX = rect.width * 0.17; 
    const maxRadiusY = rect.height * 0.17;

    // Escalar la intensidad del movimiento (400px de distancia = movimiento máximo)
    const distanceScale = Math.min(distance / 400, 1);

    // Calcular las nuevas coordenadas X e Y
    const moveX = Math.cos(angle) * maxRadiusX * distanceScale;
    const moveY = Math.sin(angle) * maxRadiusY * distanceScale;

    // Inyectar los valores en las variables CSS del elemento pupila
    pupil.style.setProperty('--dx', `${moveX}px`);
    pupil.style.setProperty('--dy', `${moveY}px`);
  });
});