// Para el primer registro
if (typeof Auth !== 'undefined') {
    Auth.redirectIfLoggedIn();
    Auth.initPasswordToggles();
}

const form = document.getElementById('register-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (typeof Auth !== 'undefined') Auth.showError('');

        const name = form.name.value.trim();
        const password = form.password.value;

        if (!name) return Auth.showError('Ingresá tu nombre.');
        if (password.length < 6) return Auth.showError('La contraseña debe tener al menos 6 caracteres.');
        if (password !== form.password2.value) return Auth.showError('Las contraseñas no coinciden.');

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            await Auth.register({ name, email: form.email.value, password });
        } catch (err) {
            Auth.showError(err.message);
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}