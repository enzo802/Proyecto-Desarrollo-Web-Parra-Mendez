// para la autentificacion del login
const Auth = (() => {
    const USERS_KEY = 'popscore_users';
    const SESSION_KEY = 'popscore_session';
    const HOME = 'home.html';
    const LOGIN = 'login.html';

    const getUsers = () => {
        try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
        catch { return {}; }
    };
    const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const normalizeEmail = (email) => email.trim().toLowerCase();

    async function hash(text) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function randomSalt() {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function startSession(user, remember) {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }));
    }

    function currentUser() {
        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY));
        } catch { return null; }
    }

    async function register({ name, email, password }) {
        const users = getUsers();
        const key = normalizeEmail(email);
        if (users[key]) throw new Error('Ya existe una cuenta con ese correo.');

        const salt = randomSalt();
        users[key] = { name: name.trim(), email: key, salt, passHash: await hash(salt + password) };
        saveUsers(users);
    }

    async function login({ email, password, remember }) {
        const user = getUsers()[normalizeEmail(email)];
        const ok = user && (await hash(user.salt + password)) === user.passHash;
        if (!ok) throw new Error('Correo o contrasena incorrectos.');
        startSession(user, remember);
        window.location.href = HOME;
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace(LOGIN);
    }

    // Para proteger paginas: si no hay sesion, vuelve al login
    function requireSession() {
        const user = currentUser();
        if (!user) window.location.replace(LOGIN);
        return user;
    }

    // Si ya hay sesion, no tiene sentido ver login/registro
    function redirectIfLoggedIn() {
        if (currentUser()) window.location.replace(HOME);
    }

    // Ojito de contrasena + la mascota cierra los ojos mientras se escribe
    function initPasswordToggles() {
        const mascot = document.querySelector('.mascot');
        const closeEyes = (closed) => mascot && mascot.classList.toggle('eyes-closed', closed);

        document.querySelectorAll('.password-wrap').forEach(wrap => {
            const input = wrap.querySelector('input');
            const btn = wrap.querySelector('.toggle-pass');

            input.addEventListener('focus', () => closeEyes(input.type === 'password'));
            input.addEventListener('blur', () => closeEyes(false));

            btn.addEventListener('click', () => {
                const show = input.type === 'password';
                input.type = show ? 'text' : 'password';
                btn.setAttribute('aria-pressed', String(show));
                btn.setAttribute('aria-label', show ? 'Ocultar contrasena' : 'Mostrar contrasena');
                closeEyes(!show && document.activeElement === input);
                input.focus();
            });
        });
    }

    function showError(message, title, buttonText) {
        let overlay = document.getElementById('auth-modal');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'auth-modal';
            overlay.className = 'modal-auth-overlay';
            overlay.innerHTML =
                '<div class="modal-auth-card" role="alertdialog" aria-modal="true" ' +
                'aria-labelledby="auth-modal-title" aria-describedby="auth-modal-msg">' +
                '<button type="button" class="modal-auth-close" aria-label="Cerrar">&times;</button>' +
                '<div class="modal-auth-icon" aria-hidden="true">' +
                '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" ' +
                'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
                '<circle cx="12" cy="12" r="10"/>' +
                '<line x1="12" y1="7" x2="12" y2="13"/>' +
                '<line x1="12" y1="17" x2="12.01" y2="17"/>' +
                '</svg>' +
                '</div>' +
                '<h3 id="auth-modal-title"></h3>' +
                '<p id="auth-modal-msg"></p>' +
                '<button type="button" class="btn-primary modal-auth-btn">Entendido</button>' +
                '</div>';
            document.body.appendChild(overlay);

            const close = () => {
                overlay.classList.remove('activo');
                if (overlay._prevFocus && overlay._prevFocus.focus) overlay._prevFocus.focus();
            };

            overlay.querySelector('.modal-auth-close').addEventListener('click', close);
            overlay.querySelector('.modal-auth-btn').addEventListener('click', close);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && overlay.classList.contains('activo')) close();
            });
        }

        // Mensaje vacio = cerrar sin mas
        if (!message) {
            overlay.classList.remove('activo');
            return;
        }

        if (!overlay.classList.contains('activo')) overlay._prevFocus = document.activeElement;

        overlay.querySelector('#auth-modal-title').textContent = title || 'Algo salio mal';
        overlay.querySelector('#auth-modal-msg').textContent = message;
        overlay.querySelector('.modal-auth-btn').textContent = buttonText || 'Entendido';

        // Reinicia la animacion si ya estaba abierta
        overlay.classList.remove('activo');
        void overlay.offsetWidth;
        overlay.classList.add('activo');

        overlay.querySelector('.modal-auth-btn').focus();
    }

    return {
        register, login, logout, currentUser, requireSession,
        redirectIfLoggedIn, initPasswordToggles, showError
    };
})();