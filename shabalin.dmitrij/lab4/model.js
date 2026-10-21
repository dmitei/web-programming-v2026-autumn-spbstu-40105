"use strict";

class game {
  constructor(title, platforms, releaseYear) {
    if (typeof title !== "string" || !title.trim()) {
      throw new Error("Введите название игры");
    }

    if (!Number.isInteger(releaseYear) ||
        releaseYear < 1 || releaseYear > 9999) {
      throw new Error("Год должен быть целым числом от 1 до 9999");
    }

    this.title = title.trim();
    this.releaseYear = releaseYear;
    this.platforms = [];
    platforms.forEach(platform => this.addPlatform(platform));
  }

  addPlatform(platform) {
    platform = platform.trim();
    if (!platform) throw new Error("Введите платформу");

    if (this.platforms.some(p =>
      p.toLowerCase() === platform.toLowerCase())) {
      throw new Error("Эта платформа уже добавлена");
    }

    this.platforms.push(platform);
  }

  removePlatform(platform) {
    const index = this.platforms.findIndex(p =>
      p.toLowerCase() === platform.trim().toLowerCase());

    if (index === -1) throw new Error("Платформа не найдена");
    this.platforms.splice(index, 1);
  }

  get platformCount() {
    return this.platforms.length;
  }
}

function groupGamesByYear(games) {
  return games.reduce((groups, item) => {
    (groups[item.releaseYear] ??= []).push(item);
    return groups;
  }, {});
}

function getUniquePlatforms(games) {
  const platforms = new Map();

  games.forEach(item => item.platforms.forEach(platform => {
    platforms.set(platform.toLowerCase(), platform);
  }));

  return [...platforms.values()];
}

function getGamesByPlatform(games, platform) {
  return games.filter(item => item.platforms.some(p =>
    p.toLowerCase() === platform.trim().toLowerCase()));
}

function groupGamesByPlatformCount(games) {
  return games.reduce((groups, item) => {
    (groups[item.platformCount] ??= []).push(item);
    return groups;
  }, {});
}

function getGamesReleasedAfter(games, year) {
  return games.filter(item => item.releaseYear > year);
}
