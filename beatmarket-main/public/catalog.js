// catalog.js

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('beatmarket_user') || 'null');
}

async function fetchTracks() {
    try {
        const res = await fetch('/api/tracks');
        if (!res.ok) throw new Error('Не вдалося завантажити треки');
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function deleteTrack(id) {
    try {
        const res = await fetch(`/api/tracks/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Не вдалося видалити трек');
        await renderTracks(); // оновлення після видалення
    } catch (e) {
        alert(e.message);
    }
}

async function fetchTracks() {
  const res = await fetch('/api/tracks');
  return res.ok ? await res.json() : [];
}

function renderTracks(tracks) {
  const container = document.getElementById('tracks-container');
  if (!container) return;

  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";

  if (tracks.length === 0) {
    container.innerHTML = '<div class="empty">Треків не знайдено.</div>';
    return;
  }

  let html = `<div class="tracks-grid">`;
  tracks.forEach(track => {
    html += `
      <div class="track-card" data-id="${track.id}">
        <div class="track-title">${track.title}</div>
        <div class="track-artist">Виконавець: ${track.artist}</div>
        ${track.genre ? `<div class="track-genre">Жанр: ${track.genre}</div>` : ""}
        <audio class="audio-player" controls>
          <source src="${track.audio}" type="audio/mp3">
          Ваш браузер не підтримує аудіо.
        </audio>
        ${isAdmin ? `<button class="btn-delete" data-id="${track.id}">Видалити</button>` : ""}
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;

  if (isAdmin) {
    document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', async e => {
        const id = button.dataset.id;
        if (confirm('Ви дійсно хочете видалити трек?')) {
          const res = await fetch(`/api/tracks/${id}`, { method: 'DELETE' });
          const updated = await fetchTracks();
          renderTracks(updated);
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const allTracks = await fetchTracks();
  renderTracks(allTracks);

  const input = document.getElementById('search-input');
  input?.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    const filtered = allTracks.filter(track =>
      track.title.toLowerCase().includes(query)
    );
    renderTracks(filtered);
  });
});

document.addEventListener('DOMContentLoaded', () => {
    renderTracks();
});





