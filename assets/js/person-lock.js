const personLock = document.querySelector('[data-birthday]');

if (personLock) {
  const personContent = document.querySelector('[data-person-content]');
  const personLockPanel = document.querySelector('[data-person-lock]');
  const personCountdown = document.querySelector('[data-person-countdown]');

  function previewEnabled() {
    const params = new URLSearchParams(window.location.search);
    return ['on', '1', 'true'].includes((params.get('preview') || '').toLowerCase())
      || window.location.hash.toLowerCase() === '#preview';
  }

  function updatePersonLock() {
    const now = new Date();
    const [month, day] = personLock.dataset.birthday.split('-').map(Number);
    const birthdayToday = now.getMonth() + 1 === month && now.getDate() === day;
    const unlocked = previewEnabled() || birthdayToday;

    personLockPanel.hidden = unlocked;
    personContent.hidden = !unlocked;

    if (unlocked) {
      document.title = `${personLock.dataset.name}的生日快樂`;
      return;
    }

    let nextBirthday = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);
    if (nextBirthday <= now) {
      nextBirthday = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0);
    }

    const totalSeconds = Math.max(0, Math.floor((nextBirthday - now) / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    personCountdown.innerHTML =
      `<div><strong>${days}</strong><small>天</small></div>` +
      `<div><strong>${String(hours).padStart(2, '0')}</strong><small>時</small></div>` +
      `<div><strong>${String(minutes).padStart(2, '0')}</strong><small>分</small></div>` +
      `<div><strong>${String(seconds).padStart(2, '0')}</strong><small>秒</small></div>`;
  }

  updatePersonLock();
  setInterval(updatePersonLock, 1000);
  window.addEventListener('hashchange', updatePersonLock);
}
