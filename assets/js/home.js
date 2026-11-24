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