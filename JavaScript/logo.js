// ojos que siguen el mouse
document.addEventListener('mousemove', (event) => {
  const eyes = document.querySelectorAll('.eye');

  eyes.forEach(eye => {
    const pupil = eye.querySelector('.pupil');
    if (!pupil) return; // por si algún ojo no tiene pupila

    // centro del ojo en pantalla
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    // distancia entre el mouse y el centro del ojo
    const deltaX = event.clientX - eyeCenterX;
    const deltaY = event.clientY - eyeCenterY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.hypot(deltaX, deltaY);

    // cuánto se puede mover la pupila como máximo (17% del ojo)
    const maxRadiusX = rect.width * 0.17;
    const maxRadiusY = rect.height * 0.17;

    // si el mouse está lejos (400px o más) la pupila llega al tope, si está cerca se mueve menos
    const distanceScale = Math.min(distance / 400, 1);

    const moveX = Math.cos(angle) * maxRadiusX * distanceScale;
    const moveY = Math.sin(angle) * maxRadiusY * distanceScale;

    // el css usa --dx y --dy para mover la pupila
    pupil.style.setProperty('--dx', `${moveX}px`);
    pupil.style.setProperty('--dy', `${moveY}px`);
  });
});

// botón de la contraseña (mostrar/ocultar) + ojos de la mascota
const togglePassBtn = document.querySelector('.toggle-pass');
const passwordInput = document.getElementById('password');
const mascot = document.querySelector('.mascot');

togglePassBtn.addEventListener('click', () => {
  // aria-pressed es el que dice si la contraseña se está viendo
  const isShowing = togglePassBtn.getAttribute('aria-pressed') === 'true';

  if (isShowing) {
    // ocultar: vuelve a puntitos y la mascota cierra los ojos
    togglePassBtn.setAttribute('aria-pressed', 'false');
    passwordInput.type = 'password';
    mascot.classList.add('eyes-closed');
  } else {
    // mostrar: se ve el texto y la mascota abre los ojos
    togglePassBtn.setAttribute('aria-pressed', 'true');
    passwordInput.type = 'text';
    mascot.classList.remove('eyes-closed');
  }
});