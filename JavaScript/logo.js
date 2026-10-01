// --- 1. LÓGICA DE SEGUIR EL CURSOR ---
document.addEventListener('mousemove', (event) => {
  const eyes = document.querySelectorAll('.eye');

  eyes.forEach(eye => {
    const pupil = eye.querySelector('.pupil');
    if (!pupil) return;

    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const deltaX = event.clientX - eyeCenterX;
    const deltaY = event.clientY - eyeCenterY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.hypot(deltaX, deltaY);

    const maxRadiusX = rect.width * 0.17;
    const maxRadiusY = rect.height * 0.17;

    const distanceScale = Math.min(distance / 400, 1);

    const moveX = Math.cos(angle) * maxRadiusX * distanceScale;
    const moveY = Math.sin(angle) * maxRadiusY * distanceScale;

    pupil.style.setProperty('--dx', `${moveX}px`);
    pupil.style.setProperty('--dy', `${moveY}px`);
  });
});

// --- 2. LÓGICA: OCULTAR CONTRASEÑA Y CERRAR OJOS ---
const togglePassBtn = document.querySelector('.toggle-pass');
const passwordInput = document.getElementById('password');
const mascot = document.querySelector('.mascot');

togglePassBtn.addEventListener('click', () => {
  const isShowing = togglePassBtn.getAttribute('aria-pressed') === 'true';

  if (isShowing) {
    togglePassBtn.setAttribute('aria-pressed', 'false');
    passwordInput.type = 'password';
    mascot.classList.add('eyes-closed');
  } else {
    togglePassBtn.setAttribute('aria-pressed', 'true');
    passwordInput.type = 'text';
    mascot.classList.remove('eyes-closed');
  }
});