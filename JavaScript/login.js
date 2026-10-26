Auth.redirectIfLoggedIn();
Auth.initPasswordToggles();

const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    await Auth.login({
      email: form.email.value,
      password: form.password.value,
      remember: form.remember.checked
    });
  } catch (err) {
    Auth.showError(
      'El correo electrónico o la contraseña ingresados no son correctos. Por favor, verificalos e intentalo de nuevo.',
      'Credenciales incorrectas',
      'Reintentar'
    );
    submitBtn.disabled = false;
  }
});