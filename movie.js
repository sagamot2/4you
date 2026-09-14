
const root = document.documentElement;
const modeToggle = document.getElementById('modeToggle');

function applyMode(mode) {
  root.setAttribute('data-mode', mode);
  if (modeToggle) modeToggle.textContent = mode === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('gus-mode', mode);
}

if (modeToggle) {
  modeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-mode');
    applyMode(current === 'dark' ? 'light' : 'dark');
  });
}

applyMode(localStorage.getItem('gus-mode') || 'dark');
 

let selectedCinema = null;
const cinemaCards = document.querySelectorAll('.cinema-card');
const cinemaEmbed = document.getElementById('cinemaEmbed');
const cinemaEmbedFrame = document.getElementById('cinemaEmbedFrame');
const cinemaEmbedName = document.getElementById('cinemaEmbedName');
const cinemaEmbedOpen = document.getElementById('cinemaEmbedOpen');

cinemaCards.forEach((card) => {
  card.addEventListener('click', () => {
    cinemaCards.forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
    selectedCinema = card.dataset.cinema;

    const url = card.dataset.url;
    const name = card.querySelector('.cinema-name').textContent;

    if (url && cinemaEmbed && cinemaEmbedFrame) {
      cinemaEmbedFrame.src = url;
      cinemaEmbedName.textContent = name;
      cinemaEmbedOpen.href = url;
      cinemaEmbed.hidden = false;
    }
  });
});
 

let dateFp = null;
let timeFp = null;

if (typeof flatpickr !== 'undefined') {
  dateFp = flatpickr('#date-select', {
    minDate: 'today',
    dateFormat: 'd M Y',
    disableMobile: true
  });
  timeFp = flatpickr('#time-select', {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    disableMobile: true
  });
}
 

const cinemaNames = { major: 'Major Cineplex', sf: 'SF Cinema' };
const showMovieBtn = document.getElementById('show-movie-btn');
const confirmNote = document.getElementById('confirmNote');

if (showMovieBtn) {
  showMovieBtn.addEventListener('click', () => {
    const dateVal = document.getElementById('date-select').value;
    const timeVal = document.getElementById('time-select').value;

    if (!selectedCinema || !dateVal || !timeVal) {
      confirmNote.textContent = 'เลือกโรง วันที่ และเวลาให้ครบก่อนนะ';
      return;
    }

    confirmNote.textContent = `นัดกันที่ ${cinemaNames[selectedCinema]} วันที่ ${dateVal} เวลา ${timeVal} นะ`;
  });
}
 

const fileInput = document.getElementById('image-upload');
const previewImg = document.getElementById('image-preview');
const previewWrapper = document.getElementById('preview-wrapper');
const removeImgBtn = document.getElementById('remove-image-btn');

if (fileInput && previewImg) {
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.setAttribute('src', e.target.result);
        previewWrapper.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
}

if (removeImgBtn) {
  removeImgBtn.addEventListener('click', () => {
    fileInput.value = '';
    previewImg.setAttribute('src', '');
    previewWrapper.style.display = 'none';
  });
}
 

const sendBtn = document.getElementById('send-discord-btn');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    sendBtn.disabled = true;
    sendBtn.textContent = 'กำลังส่ง...';

    setTimeout(() => {
      alert('ส่งให้กัสแล้ว เดี๋ยวรีบตอบนะ 💙');
      sendBtn.disabled = false;
      sendBtn.textContent = 'ส่งให้กัส 💙';
      document.getElementById('discord-msg').value = '';
      if (removeImgBtn) removeImgBtn.click();
    }, 700);
  });
}