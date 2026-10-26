Auth.redirectIfLoggedIn();
Auth.initPasswordToggles();

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;
    const password2 = form.elements['password2'].value;

    if (!name) return Auth.showError('Ingresa tu nombre.');
    if (password.length < 6) return Auth.showError('La contrasena debe tener al menos 6 caracteres.');
    if (password !== password2) return Auth.showError('Las contrasenas no coinciden.');

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
        await Auth.register({ name, email, password });

        const msg = document.getElementById('form-error');
        msg.textContent = 'Cuenta creada con exito. Redirigiendo al inicio de sesion...';
        msg.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } catch (err) {
        Auth.showError(err.message);
        submitBtn.disabled = false;
    }
});