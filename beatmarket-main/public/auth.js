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


// --- Реєстрація ---
document.getElementById('register-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const password2 = document.getElementById('register-password2').value;
  const msg = document.getElementById('register-message');

  msg.textContent = "";
  msg.style.display = "none";

  if (!username || !email || !password || password !== password2) {
    msg.textContent = "Перевірте поля!";
    msg.style.display = "block";
    return;
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Помилка');

    localStorage.setItem('beatmarket_user', JSON.stringify(data.user));
    location.href = 'catalog.html';
  } catch (err) {
    msg.textContent = err.message;
    msg.style.display = "block";
  }
});

// --- Логін ---
document.getElementById('login-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const login = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const msg = document.getElementById('login-message');

  msg.textContent = "";
  msg.style.display = "none";

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Помилка');

    localStorage.setItem('beatmarket_user', JSON.stringify(data.user));
    location.href = 'catalog.html';
  } catch (err) {
    msg.textContent = err.message;
    msg.style.display = "block";
  }
});




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
                <a href="catalog.html" class="btn btn-login">Адмін</a>
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