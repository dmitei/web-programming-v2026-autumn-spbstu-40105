export class Game {
  constructor(title, platforms, releaseYear) {
    this.title = title;
    this.platforms = [...new Set(platforms)];
    this.releaseYear = releaseYear;
  }

  addPlatform(platform) {
    const name = platform.trim();
    if (name && !this.platforms.includes(name)) {
      this.platforms.push(name);
    }
  }

  removePlatform(platform) {
    this.platforms = this.platforms.filter((name) => name !== platform);
  }

  get platformCount() {
    return this.platforms.length;
  }
}

export function groupGamesByReleaseYear(games) {
  return Map.groupBy(games, (game) => game.releaseYear);
}

export function getUniquePlatforms(games) {
  return [...new Set(games.flatMap((game) => game.platforms))];
}

export function findGamesByPlatform(games, platform) {
  return games.filter((game) => game.platforms.includes(platform));
}

export function groupGamesByPlatformCount(games) {
  return Map.groupBy(games, (game) => game.platformCount);
}

export function findGamesReleasedAfter(games, year) {
  return games.filter((game) => game.releaseYear > year);
}
