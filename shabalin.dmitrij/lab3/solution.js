export function findLongestIncreasingSubsequence(arr) {
  const tails = [];
  for (const value of arr) {
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const middle = Math.floor((left + right) / 2);
      if (tails[middle] < value) {
        left = middle + 1;
      } else {
        right = middle;
      }
    }
    tails[left] = value;
  }
  return tails.length;
}
