const peopleGrid = document.querySelector('.people-grid');
const people = peopleGrid
  ? [...peopleGrid.querySelectorAll('.person-card')]
  : [];

function daysUntilBirthday(birthday) {
  const now = new Date();
  const [month, day] = birthday.split('-').map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let nextBirthday = new Date(now.getFullYear(), month - 1, day);

  if (nextBirthday < today) {
    nextBirthday = new Date(now.getFullYear() + 1, month - 1, day);
  }

  return nextBirthday - today;
}

if (peopleGrid && people.length) {
  people.sort((a, b) =>
    daysUntilBirthday(a.dataset.birthday) - daysUntilBirthday(b.dataset.birthday)
  );

  people.forEach((person) => peopleGrid.appendChild(person));
  people[0].classList.add('is-nearest');
}

const revealItems = document.querySelectorAll('.person-card');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-ready');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('reveal-ready'));
}

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('scroll', () => {
    revealItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight * 0.5) * (index % 2 ? -0.018 : 0.012);
        item.style.setProperty('--parallax-offset', `${offset}px`);
      }
    });
  }, { passive: true });
}