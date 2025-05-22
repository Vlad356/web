const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;
const multer = require('multer');


// Щоб парсити JSON тіла запитів
app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));


// Налаштування сховища для MP3
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/audio'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });


// Функція для читання файлу JSON
function readJSON(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'data', filename), 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data || '[]'));
    });
  });
}

// Функція для запису JSON у файл
function writeJSON(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2), err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// --- GET треки ---
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await readJSON('tracks.json');
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера при читанні треків' });
  }
});

// --- GET користувачі ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await readJSON('users.json');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера при читанні користувачів' });
  }
});

// --- POST реєстрація ---
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Неповні дані' });
  }
  try {
    const users = await readJSON('users.json');
    if (users.find(u => u.username === username || u.email === email)) {
      return res.status(400).json({ error: 'Користувач вже існує' });
    }
    const newUser = { id: Date.now(), username, email, password, role: 'user' };
    users.push(newUser);
    await writeJSON('users.json', users);
    res.json({ message: 'Реєстрація успішна', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера при реєстрації' });
  }
});
// --- DELETE трек за ID ---
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Некоректний ID' });

    const tracks = await readJSON('tracks.json');
    const index = tracks.findIndex(track => track.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Трек не знайдено' });
    }

    tracks.splice(index, 1); // видаляємо
    await writeJSON('tracks.json', tracks);
    res.json({ message: 'Трек видалено' });
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера при видаленні треку' });
  }
});

// --- POST логін ---
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ error: 'Необхідно ввести логін і пароль' });
  }

  try {
    const users = await readJSON('users.json');
    const user = users.find(u =>
      (u.email === login || u.username === login) && u.password === password
    );
    if (!user) {
      return res.status(401).json({ error: 'Невірний логін або пароль' });
    }

    res.json({ message: 'Успішний вхід', user });
  } catch (err) {
    res.status(500).json({ error: 'Помилка сервера при вході' });
  }
});

// Завантаження треків
app.post('/api/upload', upload.single('trackFile'), async (req, res) => {
  const { trackTitle, trackArtist, trackGenre } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Файл не завантажено' });
  }

  try {
    const tracks = await readJSON('tracks.json');
    const newTrack = {
      id: Date.now(),
      title: trackTitle,
      artist: trackArtist,
      genre: trackGenre || '',
      audio: 'audio/' + file.filename
    };
    tracks.push(newTrack);
    await writeJSON('tracks.json', tracks);

    res.json({ message: 'Трек успішно завантажено', track: newTrack });
  } catch (err) {
    res.status(500).json({ error: 'Помилка при збереженні треку' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
