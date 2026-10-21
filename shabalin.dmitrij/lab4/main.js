"use strict";

const get = id => document.getElementById(id);
const storageKey = "variant23.task4";
let games = [];
let busy = false;

try {
  const saved = localStorage.getItem(storageKey);

  if (saved === null) {
    games = [
      new game("Minecraft", ["PC", "Xbox"], 2011),
      new game("Stray", ["PC", "PS5"], 2022)
    ];
  } else {
    games = JSON.parse(saved).map(item =>
      new game(item.title, item.platforms, item.releaseYear));
  }
} catch {
  get("status").textContent = "Не удалось загрузить сохранённые данные";
}

// Все добавления и удаления проходят через Promise + setTimeout.
async function change(action) {
  if (busy) return;
  busy = true;
  render();
  get("status").textContent = "Выполняется…";

  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          action();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 350);
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(games));
      get("status").textContent = "Изменения сохранены";
    } catch {
      get("status").textContent =
        "Изменения применены, но браузер запретил сохранение";
    }
  } catch (error) {
    get("status").textContent = error.message;
  } finally {
    busy = false;
    render();
  }
}

function createElement(tag, text) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  return element;
}

function render() {
  get("games").replaceChildren();

  games.forEach((item, index) => {
    const card = createElement("article");
    card.className = "card";

    card.append(
      createElement("h2", item.title),
      createElement("p", "Год выпуска: " + item.releaseYear),
      createElement("p", "Количество платформ: " + item.platformCount),
      createElement("p", item.platforms.join(", ") || "Платформ пока нет")
    );

    const form = createElement("form");
    const input = createElement("input");
    input.placeholder = "Новая платформа";
    input.setAttribute("aria-label", "Новая платформа");
    input.required = true;

    const add = createElement("button", "Добавить платформу");
    form.append(input, add);

    form.onsubmit = event => {
      event.preventDefault();
      const platform = input.value;
      change(() => item.addPlatform(platform));
    };

    const select = createElement("select");
    select.setAttribute("aria-label", "Платформа для удаления");

    item.platforms.forEach(platform => {
      const option = createElement("option", platform);
      option.value = platform;
      select.append(option);
    });

    const removePlatform = createElement("button", "Удалить платформу");
    select.disabled = removePlatform.disabled = !item.platformCount;

    removePlatform.onclick = () => {
      const platform = select.value;
      change(() => item.removePlatform(platform));
    };

    const removeGame = createElement("button", "Удалить игру");
    removeGame.onclick = () => change(() => games.splice(index, 1));

    card.append(form, select, removePlatform, removeGame);
    get("games").append(card);
  });

  if (!games.length) get("games").textContent = "Игр пока нет";

  if (busy) {
    document.querySelectorAll("#games input, #games select, #games button")
      .forEach(element => element.disabled = true);
  }

  get("gameForm").querySelectorAll("input, button")
    .forEach(element => element.disabled = busy);

  updateAnalytics();
}

function updateAnalytics() {
  const mode = get("analysis").value;
  get("platformFilter").hidden = mode !== "platform";
  get("yearFilter").hidden = mode !== "after";

  let result;

  switch (mode) {
    case "year":
      result = groupGamesByYear(games);
      break;
    case "platforms":
      result = getUniquePlatforms(games);
      break;
    case "platform":
      result = getGamesByPlatform(games, get("platformFilter").value);
      break;
    case "count":
      result = groupGamesByPlatformCount(games);
      break;
    case "after": {
      const value = get("yearFilter").value;
      const year = Number(value);

      if (!value || !Number.isInteger(year) || year < 1 || year > 9999) {
        get("result").textContent = "Введите целый год от 1 до 9999";
        return;
      }

      result = getGamesReleasedAfter(games, year);
      break;
    }
  }

  get("result").textContent = JSON.stringify(result, null, 2);
}

get("gameForm").onsubmit = event => {
  event.preventDefault();
  const title = get("title").value;
  const year = Number(get("year").value);

  change(() => {
    games.push(new game(title, [], year));
    get("gameForm").reset();
  });
};

get("analysis").onchange = updateAnalytics;
get("platformFilter").oninput = updateAnalytics;
get("yearFilter").oninput = updateAnalytics;

render();
