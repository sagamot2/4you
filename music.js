document.addEventListener('DOMContentLoaded', function() { 
    const modeToggle = document.getElementById('modeToggle');
    const htmlElement = document.documentElement;
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) htmlElement.setAttribute('data-mode', currentTheme);

    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            let newMode = htmlElement.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-mode', newMode);
            localStorage.setItem('theme', newMode);
        });
    }
 
    const quotes = [
        "ฟังเพลงนี้แล้วนึกถึงใคร... นึกถึงลานนาแน่เลย อิอิ 🤭💙",
        "คนอะไรไม่รู้ ยิ่งดูยิ่งน่ารักกกก ✨",
        "ที่ใจสั่นเพราะกาแฟ หรือเพราะลานนากันแน่ฟะ? ☕",
        "น่ารักกว่าแมวก็ลานนาตอนยิ้มนี่แหละ 🥰",
        "ไม่ได้เป็นคนเจ้าชู้ แค่อยากมีลานนาอยู่ข้างๆ ทุกวัน 🧸",
        "ลานนาไม่ต้องทำอะไรเลย แค่น่ารักไปวันๆ ก็พอแล้ว 🌈",
        "เพลงนี้เพราะดีนะ แต่สู้เสียงลานนาไม่ได้หรอก 🎶💙"
    ];

    const quoteElement = document.getElementById("random-quote");
    if (quoteElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.innerText = quotes[randomIndex];
    }

    const unlockBtn = document.getElementById('unlock-btn');
    const modalOverlay = document.getElementById('shopeeModal');
    const closeBtn = document.getElementById('close-shopee');
    const viewCheckout = document.getElementById('view-checkout');
    const viewAddCard = document.getElementById('view-add-card');
    const priceRadios = document.querySelectorAll('input[name="plan"]');
    const totalPriceEl = document.getElementById('total-price');
    const voucherInput = document.getElementById('voucher-code');
    const applyVoucherBtn = document.getElementById('apply-voucher');
    const voucherMsg = document.getElementById('voucher-msg');
    const payItems = document.querySelectorAll('.pay-item');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const btnCancelCard = document.getElementById('btn-cancel-card');
    const btnConfirmCard = document.getElementById('btn-confirm-card');
    const videoBlocker = document.getElementById('video-blocker');
    const ytPlayer = document.getElementById('youtube-player');
    let currentBasePrice = 9999;
    let discountPercent = 0;
 
    function updatePrice() {
        let finalPrice = currentBasePrice * (1 - discountPercent);
        totalPriceEl.innerText = `฿${finalPrice.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
 
    function closeModal() {
        modalOverlay.classList.remove('open');
        setTimeout(() => {
            viewAddCard.classList.remove('active-view');
            viewAddCard.classList.add('hidden-view');
            viewCheckout.classList.remove('hidden-view');
            viewCheckout.classList.add('active-view');
        }, 300);
    }
 
    if(unlockBtn) unlockBtn.addEventListener('click', () => modalOverlay.classList.add('open'));
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) closeModal();
    });
 
    priceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentBasePrice = parseInt(e.target.value);
            updatePrice();
        });
    });
 
    applyVoucherBtn.addEventListener('click', () => {
        const code = voucherInput.value.trim().toLowerCase();
        if(code === 'lannasocute999') {
            discountPercent = 0.99;
            voucherMsg.innerText = "🎉 โค้ดถูกต้อง! รับส่วนลดความน่ารัก 99%";
            voucherMsg.style.display = "block";
            voucherMsg.style.color = "#00bfa5";
            updatePrice();
        } else {
            discountPercent = 0;
            voucherMsg.innerText = "❌ โค้ดไม่ถูกต้อง (คำใบ้: lannasocute999)";
            voucherMsg.style.display = "block";
            voucherMsg.style.color = "#ee4d2d";
            updatePrice();
        }
    });
 
    payItems.forEach(item => {
        item.addEventListener('click', () => {
            payItems.forEach(b => b.classList.remove('active'));
            item.classList.add('active');
        });
    });
 
    function unlockVideo() {
        alert(`🎉 หักเงิน ${totalPriceEl.innerText} สำเร็จ!\n\nขอบคุณที่เปย์นะลานนา 😆 หยอกๆ กัสแค่ปั่นเล่น ไปฟังเพลงกันเถอะ 💙`);
        closeModal();
        videoBlocker.classList.add('hidden');
        let currentSrc = ytPlayer.src;
        if(!currentSrc.includes('autoplay=1')) {
            ytPlayer.src = currentSrc + "&autoplay=1";
        }
    }
 
    placeOrderBtn.addEventListener('click', () => {
        let selectedMethod = document.querySelector('.pay-item.active').getAttribute('data-method');
        
        if (selectedMethod === 'card') { 
            viewCheckout.classList.remove('active-view');
            viewCheckout.classList.add('hidden-view');
            viewAddCard.classList.remove('hidden-view');
            viewAddCard.classList.add('active-view');
        } else { 
            unlockVideo();
        }
    });
 
    btnCancelCard.addEventListener('click', () => {
        viewAddCard.classList.remove('active-view');
        viewAddCard.classList.add('hidden-view');
        viewCheckout.classList.remove('hidden-view');
        viewCheckout.classList.add('active-view');
    });
 
    btnConfirmCard.addEventListener('click', () => {
        unlockVideo();
    });
});
