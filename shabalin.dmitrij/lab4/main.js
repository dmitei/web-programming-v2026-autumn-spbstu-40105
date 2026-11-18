import {Game} from './model.js';

const storageKey = 'lab4.variant23.games';
const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');
const template = document.querySelector('#game-card');
const status = document.querySelector('#status');
let games = [];

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
  if (Array.isArray(saved)) {
    games = saved.map(
      ({title, platforms, releaseYear}) =>
        new Game(title, platforms, releaseYear),
    );
  }
} catch {
  status.textContent = 'Не удалось загрузить сохранённый каталог.';
}

async function update(change) {
  await new Promise((resolve) => setTimeout(resolve, 120));
  change();
  try {
    localStorage.setItem(storageKey, JSON.stringify(games));
    status.textContent = '';
  } catch {
    status.textContent = 'Не удалось сохранить изменения в браузере.';
  }
  render();
}

function render() {
  list.replaceChildren();
  if (games.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'В каталоге пока нет игр.';
    list.append(empty);
  }

  for (const game of games) {
    const card = template.content.cloneNode(true);
    card.querySelector('h2').textContent =
      `${game.title} · ${game.releaseYear}`;
    card.querySelector('.platforms').textContent =
      game.platforms.join(', ') || 'Платформы не указаны';

    const platformForm = card.querySelector('.platform-form');
    platformForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const platform = platformForm.elements.platform.value.trim();
      if (!platform) {
        return;
      }
      const remove = event.submitter?.value === 'remove';
      void update(() => {
        if (remove) {
          game.removePlatform(platform);
        } else {
          game.addPlatform(platform);
        }
      });
    });

    card
      .querySelector('[data-testid="delete-entity"]')
      .addEventListener('click', () => {
        void update(() => {
          games = games.filter((entry) => entry !== game);
        });
      });
    list.append(card);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  const releaseYear = form.elements.releaseYear.valueAsNumber;
  if (!title || !Number.isInteger(releaseYear)) {
    return;
  }
  form.reset();
  void update(() => games.push(new Game(title, [], releaseYear)));
});

render();
