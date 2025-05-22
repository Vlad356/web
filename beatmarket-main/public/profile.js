// profile.js

// Показ даних поточного користувача
function showProfile() {
  const user = JSON.parse(localStorage.getItem("beatmarket_user") || "null");
  if (user) {
    document.getElementById("user-name").textContent = user.username;
    document.getElementById("user-email").textContent = user.email;
  } else {
    // Якщо користувач не авторизований, можна перенаправити на логін
    location.href = "login.html";
  }
}

showProfile();

document.getElementById("upload-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const msg = document.getElementById("upload-message");

  // Очистка перед новою спробою
  msg.textContent = "";
  msg.style.color = "#f1f1f1";

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Помилка");

    msg.style.color = "#36d399";
    msg.textContent = "Трек успішно завантажено!";
    form.reset();
    document.getElementById("selected-file-name").textContent = "Файл не обрано";
  } catch (err) {
    msg.style.color = "#d73340";
    msg.textContent = `❌ ${err.message}`;
  }

  // 🧼 Автоматично прибрати повідомлення через 3.5 сек
  setTimeout(() => {
    msg.textContent = "";
  }, 3500);
});



document.getElementById("track-file")?.addEventListener("change", function () {
  const fileNameSpan = document.getElementById("selected-file-name");
  if (this.files.length > 0) {
    fileNameSpan.textContent = `Обрано: ${this.files[0].name}`;
  } else {
    fileNameSpan.textContent = "Файл не обрано";
  }
});
