const root = document.documentElement;
const modeIcon = document.getElementById('modeIcon');

function applyMode(mode) {
  root.setAttribute('data-mode', mode);
  if (modeIcon) modeIcon.textContent = mode === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('gus-mode', mode);
}

function toggleMode() {
  const current = root.getAttribute('data-mode');
  applyMode(current === 'dark' ? 'light' : 'dark');
}

applyMode(localStorage.getItem('gus-mode') || 'dark');

const YT_VIDEO_ID = 'MaeX5dV0njY';
const YT_START_SECONDS = 65;

const musicIcon = document.getElementById('musicIcon');
const musicBtn = document.getElementById('musicBtn');

let ytPlayer = null;
let ytReady = false;
let wantsPlay = false; 

function setMusicUI(playing) {
  if (musicIcon) musicIcon.textContent = playing ? '♪' : '♫';
  if (musicBtn) {
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }
}

function onYouTubeIframeAPIReady() {
  if (!document.getElementById('ytPlayer')) return;
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YT_VIDEO_ID, 
      playsinline: 1,
      start: YT_START_SECONDS
    },
    events: {
      onReady: () => {
        ytReady = true;
        ytPlayer.setVolume(35);
        if (localStorage.getItem('gus-music') === 'on') {
          const resume = () => {
            ytPlayer.playVideo();
            document.removeEventListener('click', resume);
            document.removeEventListener('touchstart', resume);
          };
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
        }
        if (wantsPlay) ytPlayer.playVideo();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) setMusicUI(true);
        if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) setMusicUI(false);
      }
    }
  });
}

function toggleMusic() {
  if (!ytReady || !ytPlayer) {
    wantsPlay = true;
    localStorage.setItem('gus-music', 'on');
    return;
  }
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
    localStorage.setItem('gus-music', 'off');
  } else {
    ytPlayer.playVideo();
    localStorage.setItem('gus-music', 'on');
  }
}

const transitionOverlay = document.getElementById('pageTransition');

requestAnimationFrame(() => {
  document.body.classList.add('page-ready');
});

if (transitionOverlay) {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const isSamePage = !href || href.startsWith('#');
    const isExternal = link.target === '_blank' || /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;
    if (isSamePage || isExternal || isModifiedClick) return;

    e.preventDefault();
    transitionOverlay.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 280);
  });
}

const bar = document.getElementById('progressBar');
if (bar) {
  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

function tick() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const now  = new Date();
  el.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(v => String(v).padStart(2, '0'))
    .join(':');
}
setInterval(tick, 1000);
tick();
 
const popup = document.getElementById('discordPopup');
const openBtn = document.getElementById('openPopupBtn');
const btnYes = document.getElementById('dcBtnYes');
const btnNo = document.getElementById('dcBtnNo');
const fileInput = document.getElementById('gf-image-upload');
const previewImg = document.getElementById('gf-image-preview');
const removeImgBtn = document.getElementById('gf-remove-image-btn');
const previewWrapper = document.getElementById('gf-preview-wrapper');
 
if(openBtn && popup) {
    openBtn.addEventListener('click', () => {
        popup.classList.add('active');
    });
}
 
if (popup && sessionStorage.getItem('gf-popup-shown') !== '1') {
    setTimeout(() => {
        popup.classList.add('active');
        sessionStorage.setItem('gf-popup-shown', '1');
    }, 1200);
}
 
if(btnNo) {
    btnNo.addEventListener('click', () => {
        popup.classList.remove('active');
    });
}
 
if(btnYes) {
    btnYes.addEventListener('click', async () => {
        const msgInput = document.getElementById('gf-msg');
        const message = msgInput ? msgInput.value.trim() : '';
        const file = fileInput && fileInput.files[0];

        const originalLabel = btnYes.textContent;
        btnYes.disabled = true;
        btnYes.textContent = 'กำลังส่ง...';

        try {
            const formData = new FormData();
            const payload = {
                content: [
                    '💙 **ตอบตกลงเป็นแฟนแล้ว!**',
                    message ? `ข้อความ: ${message}` : null
                ].filter(Boolean).join('\n')
            };
            formData.append('payload_json', JSON.stringify(payload));
            if (file) {
                formData.append('files[0]', file, file.name);
            }

            const res = await fetch('/.netlify/functions/notify', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('send failed: ' + res.status);

            alert('ส่งใบสมัครเรียบร้อย! รอฟังข่าวดีนะค้าบ 💙');
            popup.classList.remove('active');
            if (msgInput) msgInput.value = '';
            if (removeImgBtn) removeImgBtn.click();
        } catch (err) {
            console.error(err);
            alert('ส่งไม่สำเร็จ เช็กเน็ตแล้วลองใหม่อีกทีนะ 🥲');
        } finally {
            btnYes.disabled = false;
            btnYes.textContent = originalLabel;
        }
    });
}
 
if(fileInput && previewImg) {
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.setAttribute('src', e.target.result);
                previewWrapper.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
}
 
if(removeImgBtn) {
    removeImgBtn.addEventListener('click', () => {
        fileInput.value = '';
        previewImg.setAttribute('src', '');
        previewWrapper.style.display = 'none';
    });
}