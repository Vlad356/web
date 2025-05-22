// catalog.js

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('beatmarket_user') || 'null');
}

// Ініціалізація треків у локальному сховищі (один раз)
function getTracks() {
    let tracks = JSON.parse(localStorage.getItem('beatmarket_tracks') || 'null');
    if (!tracks) {
        tracks = [
            { id: 1, name: 'Urban Beat', artist: 'DJ Energy', genre: 'Хіп-хоп', audio: 'audio/track1.mp3' },
            { id: 2, name: 'Digital Dreams', artist: 'BeatMaster', genre: 'Електроніка', audio: 'audio/track2.mp3' },
            { id: 3, name: 'Sunny Vibes', artist: 'SonicFlow', genre: 'Поп', audio: 'audio/track3.mp3' }
        ];
        localStorage.setItem('beatmarket_tracks', JSON.stringify(tracks));
    }
    return tracks;
}
function saveTracks(tracks) {
    localStorage.setItem('beatmarket_tracks', JSON.stringify(tracks));
}

// Відображення треків
function renderTracks(tracks) {
    const container = document.getElementById('tracks-container');
    const user = getCurrentUser();
    if (!container) return;
    if (!tracks.length) {
        container.innerHTML = '<div class="empty">Немає треків.</div>';
        return;
    }
    let html = `<div class="tracks-grid">`;
    tracks.forEach(track => {
        html += `
        <div class="track-card">
            <div class="track-title">${track.name}</div>
            <div class="track-artist">Виконавець: ${track.artist}</div>
            <div class="track-genre">Жанр: ${track.genre}</div>
            <audio class="audio-player" controls>
                <source src="${track.audio}" type="audio/mp3">
                Ваш браузер не підтримує аудіо.
            </audio>
            ${user && user.role === "admin" ? `<button class="btn btn-delete" onclick="deleteTrack(${track.id})">Видалити</button>` : ""}
        </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}

// Видалення треку (для адміна)
window.deleteTrack = function(id) {
    let tracks = getTracks().filter(t => t.id !== id);
    saveTracks(tracks);
    renderTracks(getTracks());
}

document.addEventListener('DOMContentLoaded', function() {
    // Показати треки після завантаження сторінки
    renderTracks(getTracks());
});
