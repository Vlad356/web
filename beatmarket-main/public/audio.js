document.addEventListener('play', function (e) {
  // якщо це <audio> — ставимо інші на паузу
  if (e.target.tagName === 'AUDIO') {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      if (audio !== e.target) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }
}, true); // useCapture = true для спрацьовування до bubbling

document.addEventListener('play', function (e) {
  if (e.target.tagName === 'AUDIO') {
    const allCards = document.querySelectorAll('.track-card');
    allCards.forEach(card => card.classList.remove('playing'));

    const playingAudio = e.target;
    const card = playingAudio.closest('.track-card');
    if (card) card.classList.add('playing');

    // Скидаємо всі інші аудіо
    document.querySelectorAll('audio').forEach(audio => {
      if (audio !== playingAudio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }
}, true);

// Коли трек зупиняється вручну або завершується — прибрати підсвічування
document.addEventListener('pause', function (e) {
  if (e.target.tagName === 'AUDIO') {
    const card = e.target.closest('.track-card');
    if (card) card.classList.remove('playing');
  }
}, true);