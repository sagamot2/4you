const loveYesBtn = document.getElementById('loveYesBtn');
const loveNoBtn = document.getElementById('loveNoBtn');
const loveBox = document.getElementById('loveBox');

async function notifyDiscord(content) {
    const formData = new FormData();
    formData.append('payload_json', JSON.stringify({ content }));

    const res = await fetch('/.netlify/functions/notify', {
        method: 'POST',
        body: formData
    });

    if (!res.ok) throw new Error('send failed: ' + res.status);
}

function showThankYou() {
    if (!loveBox) return;
    loveBox.innerHTML = `
        <h2>ยินดีด้วยย 💙</h2>
        <p>ขอบคุณที่ตอบตกลงนะ<br>เดี๋ยวกัสรีบไปหาเลย</p>
        <a href="index.html" class="back-button">กลับหน้าแรก 💫</a>
    `;
}

function showMoviePrompt() {
    if (!loveBox) return;
    loveBox.innerHTML = `
        <h2>งั้นลองไปดูหนังด้วยกันก่อนไหม 🎬</h2>
        <p>ยังไม่ต้องตอบเรื่องแฟนตอนนี้ก็ได้<br>ไปดูหนังด้วยกันก่อนดีไหม</p>
        <div class="love-actions">
            <button id="movieYesBtn" class="back-button">ไปดูหนังด้วยกัน 💙</button>
            <button id="movieNoBtn" class="back-button back-button--ghost">ไม่ไป</button>
        </div>
    `;

    const movieYesBtn = document.getElementById('movieYesBtn');
    const movieNoBtn = document.getElementById('movieNoBtn');

    if (movieYesBtn) {
        movieYesBtn.addEventListener('click', async () => {
            movieYesBtn.disabled = true;
            movieYesBtn.textContent = 'กำลังพาไป...';
            try {
                await notifyDiscord('🎬 **ตอบตกลงไปดูหนังด้วยกัน!** (จากหน้า Love)');
            } catch (err) {
                console.error(err);
            } finally {
                window.location.href = 'movie.html';
            }
        });
    }

    if (movieNoBtn) {
        movieNoBtn.addEventListener('click', () => {
            alert('งั้นไว้ก่อนน้า 🥺');
        });
    }
}

if (loveYesBtn) {
    loveYesBtn.addEventListener('click', async () => {
        const originalLabel = loveYesBtn.textContent;
        loveYesBtn.disabled = true;
        loveYesBtn.textContent = 'กำลังส่ง...';

        try {
            await notifyDiscord('💙 **ตอบตกลงเป็นแฟนแล้ว!** (จากหน้า Love)');
            showThankYou();
        } catch (err) {
            console.error(err);
            alert('ส่งไม่สำเร็จ เช็กเน็ตแล้วลองใหม่อีกทีนะ 🥲');
            loveYesBtn.disabled = false;
            loveYesBtn.textContent = originalLabel;
        }
    });
}

if (loveNoBtn) {
    loveNoBtn.addEventListener('click', async () => {
        const originalLabel = loveNoBtn.textContent;
        loveNoBtn.disabled = true;

        try {
            await notifyDiscord('🤔 ขอคิดดูก่อน... (จากหน้า Love)');
            showMoviePrompt();
        } catch (err) {
            console.error(err);
            alert('ส่งไม่สำเร็จ เช็กเน็ตแล้วลองใหม่อีกทีนะ 🥲');
            loveNoBtn.disabled = false;
            loveNoBtn.textContent = originalLabel;
        }
    });
}