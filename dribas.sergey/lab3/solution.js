export function shuffleArray(arr) {
  const shuffled = [];

  while (arr.length > 0) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    shuffled.push(arr.splice(randomIndex, 1)[0]);
  }
  arr.push(...shuffled);
  return arr;
}
