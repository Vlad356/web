import React, { useEffect, useState } from 'react';
import WeatherWidget from './WeatherWidget';

function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.initAuth) {
      window.initAuth();
    }

    fetch('/api/tracks')
      .then(res => {
        if (!res.ok) throw new Error('Помилка при завантаженні треків');
        return res.json();
      })
      .then(data => {
        // Перемішуємо масив треків 
        const shuffled = [...data];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // Беремо перші 9
        setTracks(shuffled.slice(0, 9));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <main>
        <h1 id="catalog-title">Треки дня</h1>

        {loading && <p>Завантаження треків...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="tracks-grid">
          {tracks.map(track => (
            <div key={track.id} className="track-card">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">Виконавець: {track.artist}</div>
              <audio className="audio-player" controls>
                <source src={track.audio} type="audio/mp3" />
                Ваш браузер не підтримує аудіо.
              </audio>
            </div>
          ))}
        </div>

        <WeatherWidget />
      </main>
    </div>
  );
}

export default App;
