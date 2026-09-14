const overlay = document.getElementById('start-overlay');
const candleWrap = document.getElementById('candleWrap');
const musicPlayer = document.getElementById('bg-music');

function spawnSmoke() {
  for (let i = 0; i < 6; i++) {
    const wisp = document.createElement('span');
    wisp.className = 'smoke-wisp';
    wisp.style.setProperty('--sx', (Math.random() * 30 - 15) + 'px');
    wisp.style.animationDelay = (i * 0.07) + 's';
    candleWrap.appendChild(wisp);
    setTimeout(() => wisp.remove(), 1600);
  }
}

if (overlay && candleWrap) {
  overlay.addEventListener('click', function () {
    candleWrap.classList.add('blown');
    spawnSmoke();

    if (musicPlayer) {
      musicPlayer.src = 'https://www.youtube.com/embed/Itvw76ej4Mk?start=23&autoplay=1&playsinline=1';
    }

    setTimeout(() => {
      overlay.classList.add('dismissed');
      if (window.burstConfetti) window.burstConfetti();
      setTimeout(() => { overlay.style.display = 'none'; }, 900);
    }, 550);
  });
}
 
const track = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('sliderDots');
let currentSlide = 0;

if (track && dotsWrap) {
  const totalSlides = track.children.length;
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsWrap.appendChild(dot);
  }
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }, 3000);
}
 
const canvas = document.getElementById('bg');
const card = document.querySelector('.card');

function resize() {
  if (!canvas || !card) return;
  canvas.width = card.offsetWidth || 340;
  canvas.height = card.scrollHeight || 700;
}
resize();
window.addEventListener('resize', resize);
window.addEventListener('load', resize);

const ctx = canvas ? canvas.getContext('2d') : null;
let burst = [];
let rafId = null;

const PALETTE = ['#86b6db', '#5c8fb8', '#f3c477', '#e3a99c'];

if (ctx) {
  function drawHeart(x, y, s, col, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x, y + s * .3);
    ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * .3);
    ctx.bezierCurveTo(x - s, y + s * .65, x, y + s * .9, x, y + s * 1.1);
    ctx.bezierCurveTo(x, y + s * .9, x + s, y + s * .65, x + s, y + s * .3);
    ctx.bezierCurveTo(x + s, y, x, y, x, y + s * .3);
    ctx.fill(); ctx.restore();
  }

  function drawSpark(x, y, s, col, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const ang = (Math.PI / 2) * i;
      ctx.lineTo(x + Math.cos(ang) * s, y + Math.sin(ang) * s);
      ctx.lineTo(x + Math.cos(ang + Math.PI / 4) * s * .35, y + Math.sin(ang + Math.PI / 4) * s * .35);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function drawShape(p) {
    if (p.type === 'heart') drawHeart(p.x, p.y, p.size, p.color, p.alpha);
    else drawSpark(p.x, p.y, p.size, p.color, p.alpha);
  }

  window.burstConfetti = function () {
    const W = canvas.width, H = canvas.height || 800;
    const cx = W / 2, cy = H * 0.32;
    for (let i = 0; i < 26; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.6 + 1.2;
      burst.push({
        type: Math.random() > 0.5 ? 'heart' : 'spark',
        x: cx, y: cy,
        size: Math.random() * 5 + 3,
        alpha: 1,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - 1,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 0
      });
    }
    if (!rafId) rafId = requestAnimationFrame(frame);
  };

  function frame() {
    const W = canvas.width, H = canvas.height || 800;
    ctx.clearRect(0, 0, W, H);

    burst = burst.filter(p => p.alpha > 0.02);
    for (const p of burst) {
      drawShape(p);
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.055;
      p.life += 1;
      p.alpha = Math.max(0, 1 - p.life / 55);
    }

    if (burst.length > 0) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = null;
    }
  }
}