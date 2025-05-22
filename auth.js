// auth.js

function getUsers() {
    return JSON.parse(localStorage.getItem('beatmarket_users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('beatmarket_users', JSON.stringify(users));
}
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('beatmarket_user') || 'null');
}

// --- Додаємо адміна якщо не існує (один раз!) ---
(function addAdminOnce() {
    let users = getUsers();
    if (!users.some(u => u.role === "admin")) {
        users.push({
            username: "admin",
            email: "admin@beatmarket.com",
            password: "admin123",
            role: "admin"
        });
        saveUsers(users);
    }
})();

// --- Реєстрація ---
if (document.querySelector('form') && location.pathname.includes('register')) {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Очищаємо попереднє повідомлення
        const msg = document.getElementById('register-message');
        msg.style.display = "none";
        msg.textContent = "";
        msg.className = "form-message";

        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const password2 = document.getElementById('register-password2').value;

        if (!username || !email || !password) {
            msg.textContent = "Заповніть всі поля!";
            msg.classList.add('error');
            msg.style.display = "block";
            return;
        }
        if (password !== password2) {
            msg.textContent = "Паролі не співпадають!";
            msg.classList.add('error');
            msg.style.display = "block";
            return;
        }
        let users = getUsers();
        if (users.find(u => u.username === username || u.email === email)) {
            msg.textContent = "Користувач із таким ім'ям або email вже існує!";
            msg.classList.add('error');
            msg.style.display = "block";
            return;
        }
        const newUser = { username, email, password, role: "user" };
        users.push(newUser); // автоматично гість!
        saveUsers(users);

        // ---- Автоматичний логін ----
        msg.textContent = "Ви успішно зареєстровані! Зачекайте...";
        msg.classList.add('success');
        msg.style.display = "block";

        localStorage.setItem('beatmarket_user', JSON.stringify(newUser));
        setTimeout(() => { location.href = 'catalog.html'; }, 1300); // невелика затримка для повідомлення
    });
}

// --- Логін ---
if (document.querySelector('form') && location.pathname.includes('login')) {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        const msg = document.getElementById('login-message');
        msg.style.display = "none";
        msg.textContent = "";
        msg.className = "form-message";

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        let users = getUsers();
        let user = users.find(u =>
            (u.username === username || u.email === username) && u.password === password
        );
        if (!user) {
            msg.textContent = "Невірний логін або пароль!";
            msg.classList.add('error');
            msg.style.display = "block";
            return;
        }

        msg.textContent = "Ви успішно увійшли! Перенаправлення...";
        msg.classList.add('success');
        msg.style.display = "block";
        localStorage.setItem('beatmarket_user', JSON.stringify(user));
        setTimeout(() => { location.href = 'catalog.html'; }, 1100);
    });
}


// --- Динамічний navbar (додається на всіх сторінках) ---
function updateNavBar() {
    let navRight = document.getElementById('nav-right');
    if (!navRight) return;
    const user = getCurrentUser();

    if (user) {
        let html = `
            <a href="profile.html" class="btn btn-login">Профіль</a>
            <a href="#" class="btn btn-register" onclick="logout();return false;">Вийти</a>
        `;
        if (user.role === "admin") {
            html = `
                <a href="catalog.html" class="btn btn-login">Адмін-панель</a>
                <a href="profile.html" class="btn btn-login">Профіль</a>
                <a href="#" class="btn btn-register" onclick="logout();return false;">Вийти</a>
            `;
        }
        navRight.innerHTML = html;
    } else {
        navRight.innerHTML = `
            <a href="login.html" class="btn btn-login">Логін</a>
            <a href="register.html" class="btn btn-register">Реєстрація</a>
        `;
    }
}
function logout() {
    localStorage.removeItem('beatmarket_user');
    location.href = 'login.html';
}
updateNavBar();


// --- Показ модального вікна для гостей ---
function showGuestModal() {
    let modal = document.getElementById('guest-modal');
    if (modal) modal.style.display = "flex";
    document.body.style.overflow = 'hidden';
}

if (!['login', 'register', 'profile'].some(x => location.pathname.includes(x))) {
    if (!getCurrentUser()) {
        showGuestModal();
    }
}