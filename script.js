const buttons = [...document.querySelectorAll('.wish-button')];
const mainTitle = document.getElementById('mainTitle');
const lockPanel = document.getElementById('lockPanel');
const progressArea = document.getElementById('progressArea');
const wishGrid = document.getElementById('wishGrid');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const wishMessage = document.getElementById('wishMessage');
const instruction = document.getElementById('instruction');
const finalCard = document.getElementById('finalCard');
const closeCard = document.getElementById('closeCard');
const birthdayVideo = document.getElementById('birthdayVideo');
const giftChooser = document.getElementById('giftChooser');
const giftOptions = [...document.querySelectorAll('.gift-option')];
const giftSelection = document.getElementById('giftSelection');
const confirmGift = document.getElementById('confirmGift');
const backToCard = document.getElementById('backToCard');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

let completed = 0;

const revealParts = [2026, 11, 19];
let isUnlocked = false;

function hasPreviewFlag() {
  const params = new URLSearchParams(window.location.search);
  const value = (params.get('preview') || '').toLowerCase();
  return value === 'on' || value === '1' || value === 'true'
    || window.location.hash.toLowerCase() === '#preview';
}

function applyLockState() {
  const now = new Date();
  const unlockAt = new Date(revealParts[0], revealParts[1] - 1, revealParts[2], 0, 0, 0);
  const unlocked = hasPreviewFlag() || now >= unlockAt;

  if (!unlocked) {
    isUnlocked = false;
    document.title = '驚喜準備中';
    lockPanel.hidden = false;
    progressArea.classList.add('locked');
    wishGrid.classList.add('locked');
    wishMessage.classList.add('locked');
    return;
  }

  if (!isUnlocked) {
    isUnlocked = true;
    document.title = '驚喜來囉';
    mainTitle.textContent = '生日快樂！';
    instruction.textContent = '請依序點亮 10 顆星星，收集今天的生日祝福';
    lockPanel.hidden = true;
    progressArea.classList.remove('locked');
    wishGrid.classList.remove('locked');
    wishMessage.classList.remove('locked');
  }
}

applyLockState();
setInterval(applyLockState, 30000);
window.addEventListener('hashchange', applyLockState);

function updateProgress() {
  progressFill.style.width = `${completed * 10}%`;
  progressText.textContent = `${completed} / 10`;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    applyLockState();
    if (!isUnlocked || button.classList.contains('lit')) return;

    button.classList.add('lit');
    completed += 1;
    wishMessage.textContent = button.dataset.wish;
    updateProgress();

    if (completed === 10) {
      instruction.textContent = '十個心願已經集齊！生日驚喜正在到來';
      setTimeout(showCard, 650);
    }
  });
});

function showCard() {
  finalCard.classList.add('show');
  launchConfetti();
}

closeCard.addEventListener('click', () => {
  birthdayVideo.pause();
  birthdayVideo.currentTime = 0;
  finalCard.classList.remove('show');
  giftChooser.classList.add('show');
  giftChooser.setAttribute('aria-hidden', 'false');
});

giftOptions.forEach((option) => {
  option.addEventListener('click', () => {
    giftOptions.forEach((item) => {
      item.classList.remove('selected');
      item.setAttribute('aria-checked', 'false');
    });
    option.classList.add('selected');
    option.setAttribute('aria-checked', 'true');
    giftSelection.textContent = `已選擇：${option.dataset.gift}`;
    confirmGift.disabled = false;
  });
});

confirmGift.addEventListener('click', () => {
  const selected = document.querySelector('.gift-option.selected');
  if (!selected) return;

  giftSelection.textContent = `選擇完成：${selected.dataset.gift}`;
  confirmGift.textContent = '已確認';
  confirmGift.disabled = true;
});

backToCard.addEventListener('click', () => {
  giftChooser.classList.remove('show');
  giftChooser.setAttribute('aria-hidden', 'true');
  finalCard.classList.add('show');
  confirmGift.textContent = '確認選擇';
  confirmGift.disabled = true;
  giftOptions.forEach((item) => {
    item.classList.remove('selected');
    item.setAttribute('aria-checked', 'false');
  });
  giftSelection.textContent = '請選擇一個禮物方式';
  wishMessage.textContent = '再點一次也會留下同樣的祝福 ✦';
});

function launchConfetti() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = ['#ef9aaa', '#e8b86d', '#fff4c9', '#91bda9', '#b98aa2'];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * .4,
    size: 5 + Math.random() * 7,
    speed: 2 + Math.random() * 4,
    drift: -1.5 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: Math.random() * Math.PI,
    spin: -.12 + Math.random() * .24
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift + Math.sin(frame * .03 + piece.angle) * .35;
      piece.angle += piece.spin;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.angle);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * .65);
      ctx.restore();
    });

    frame += 1;
    if (frame < 240) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  animate();
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
