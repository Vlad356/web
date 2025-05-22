import React, { useState } from "react";

const API_KEY = "cbf3dff9c65765e53f8f2b86b464c68d"; // заміни на реальний з openweathermap.org

export default function WeatherWidget() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeather(e) {
    e.preventDefault();
    setError("");
    setForecast(null);
    setLoading(true);
    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric&lang=ua`
      );
      if (!resp.ok) throw new Error("Місто не знайдено!");
      const data = await resp.json();
      // добираємо прогноз на 3 дні
      const daily = [];
      for (let i = 0; i < data.list.length; i += 8) {
        daily.push(data.list[i]);
        if (daily.length === 3) break;
      }
      setForecast({ city: data.city.name, list: daily });
    } catch (e) {
      setError(e.message || "Помилка");
    }
    setLoading(false);
  }

  return (
    <div className="weather-widget">
      <h3>Погода на 3 дні</h3>
      <form onSubmit={fetchWeather} className="weather-form">
        <input
          type="text"
          placeholder="Введіть місто"
          value={city}
          onChange={e => setCity(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !city}>
          {loading ? "Завантаження..." : "Дізнатись"}
        </button>
      </form>
      {error && <div className="weather-error">{error}</div>}
      {forecast && (
        <div className="weather-forecast">
          <h4>{forecast.city}</h4>
          <div className="weather-days">
            {forecast.list.map((item, idx) => (
              <div key={idx} className="weather-day">
                <div>{new Date(item.dt * 1000).toLocaleDateString()}</div>
                <div>
                  {item.weather[0].description}
                  <img
                    alt={item.weather[0].main}
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  />
                </div>
                <div>
                  {Math.round(item.main.temp)}°C&nbsp;
                  <span className="weather-minmax">
                    ({Math.round(item.main.temp_min)}..{Math.round(item.main.temp_max)}°)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
