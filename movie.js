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
  sendBtn.addEventListener('click', async () => {
    const originalLabel = sendBtn.textContent;
    sendBtn.disabled = true;
    sendBtn.textContent = 'กำลังส่ง...';

    const msgInput = document.getElementById('discord-msg');
    const message = msgInput ? msgInput.value.trim() : '';
    const file = fileInput && fileInput.files[0];
    const planNote = confirmNote ? confirmNote.textContent.trim() : '';

    try {
      const contentLines = ['🍿 **แผนดูหนัง**'];
      if (planNote) contentLines.push(planNote);
      if (message) contentLines.push(`ข้อความ: ${message}`);

      const formData = new FormData();
      formData.append('payload_json', JSON.stringify({ content: contentLines.join('\n') }));
      if (file) {
        formData.append('files[0]', file, file.name);
      }

      const res = await fetch('/.netlify/functions/notify', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('send failed: ' + res.status);

      alert('ส่งให้กัสแล้ว เดี๋ยวรีบตอบนะ 💙');
      if (msgInput) msgInput.value = '';
      if (removeImgBtn) removeImgBtn.click();
    } catch (err) {
      console.error(err);
      alert('ส่งไม่สำเร็จ เช็กเน็ตแล้วลองใหม่อีกทีนะ 🥲');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = originalLabel;
    }
  });
}
