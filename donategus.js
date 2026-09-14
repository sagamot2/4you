let currentAmount = 60; 
const promptpayID = "0801138627";

function selectAmount(amount, btnElement) {
    document.getElementById('customInputWrapper').classList.remove('show');
    document.getElementById('customAmount').value = '';
    document.querySelectorAll('.amount-card').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    currentAmount = amount;
    updateMainButton();
}

function toggleCustomInput(btnElement) {
    document.querySelectorAll('.amount-card').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    const inputWrapper = document.getElementById('customInputWrapper');
    inputWrapper.classList.add('show');
    const inputField = document.getElementById('customAmount');
    inputField.focus();
    currentAmount = inputField.value ? parseInt(inputField.value) : 0;
    updateMainButton();
}

function updateCustomAmount(val) {
    currentAmount = val ? parseInt(val) : 0;
    updateMainButton();
}

function updateMainButton() {
    const btn = document.getElementById('supportBtn');
    if (currentAmount > 0) {
        btn.textContent = `เปย์เลย ${currentAmount.toLocaleString('th-TH')} 💙`;
        btn.disabled = false;
        btn.style.opacity = '1';
    } else {
        btn.textContent = `ระบุจำนวนความรักหน่อยสิ 🥺`;
        btn.disabled = true;
        btn.style.opacity = '0.5';
    }
}

function openPaymentModal() {
    if (currentAmount <= 0) return;
    document.getElementById('modalTotalAmount').textContent = `${currentAmount.toLocaleString('th-TH')} 💙`;
    
    const qrImg = document.getElementById('promptpayQR');
    qrImg.src = `https://promptpay.io/${promptpayID}/${currentAmount}.png`;
    
    document.getElementById('paymentModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    history.pushState({ modal: 'payment' }, '');
}

function closePaymentModal(fromButton = false) {
    const modal = document.getElementById('paymentModal');
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    
    if (fromButton && history.state && history.state.modal === 'payment') {
        history.back();
    }
}

window.addEventListener('popstate', function(e) {
    const modal = document.getElementById('paymentModal');
    if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
});

document.getElementById('paymentModal').addEventListener('click', function(e) {
    if (e.target === this) closePaymentModal();
});

function switchPaymentTab(tabId, btnElement) {
    document.querySelectorAll('.m-tab').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    document.querySelectorAll('.payment-view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');
}

function payWithLove() {
    const msg = document.getElementById('backerMessage').value.trim();
    const btn = document.querySelector('#view-love .btn-main');
    
    btn.innerText = "กำลังประมวลผลความรัก... ⏳";
    btn.disabled = true;

    const payload = {
        content: `💖 **ด่วน! ลานนาเปย์ความรักให้กัสแล้ว!**\n> จำนวน: **${currentAmount.toLocaleString('th-TH')} 💙**\n> ข้อความ: "${msg || 'ไม่มีข้อความ (แต่มีความรักส่งมาเต็มๆ)'}"`
    };

    fetch('/.netlify/functions/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => {
        alert("ทำรายการสำเร็จ! ✨\nชำระเงินด้วย 'ความรัก' เรียบร้อยแล้วยัยบ๊องง 🥰💙");
        closePaymentModal(true);
        document.getElementById('backerMessage').value = '';
    }).catch(() => {
        alert("ส่งความรักสำเร็จ! 💙");
        closePaymentModal(true);
    }).finally(() => {
        btn.innerText = "ชำระด้วยความรัก ยืนยัน!";
        btn.disabled = false;
    });
}

function linkCard() {
    alert("❌ รูดบัตรไม่ผ่าน!\nระบบตรวจพบว่าเป็นบัตรคนคลั่งรัก กรุณาใช้ช่องทาง 'ความรัก' ในการชำระเงินแทนครับ 😆💙");
    const loveTabBtn = document.querySelector('.m-tab:nth-child(1)');
    switchPaymentTab('love', loveTabBtn);
}

let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function copyData(val, msg) {
    if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = val;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(msg);
        } catch (err) {
            showToast('คัดลอกไม่สำเร็จ');
        }
        document.body.removeChild(textArea);
        return;
    }

    navigator.clipboard.writeText(val).then(() => {
        showToast(msg);
        if (navigator.vibrate) navigator.vibrate(40);
    }).catch(() => {
        showToast('คัดลอกไม่สำเร็จ ลองอีกครั้ง');
    });
}
