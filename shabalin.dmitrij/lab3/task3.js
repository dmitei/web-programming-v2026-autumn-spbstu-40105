function findLongestIncreasingSubsequence(arr) {
  if (arr.length === 0) return 0;

  const lengths = new Array(arr.length).fill(1);
  let longest = 1;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        lengths[i] = Math.max(lengths[i], lengths[j] + 1);
      }
    }
    longest = Math.max(longest, lengths[i]);
  }

  return longest;
}

const numbers = [10, 9, 2, 5, 3, 7, 101, 18];
console.log(findLongestIncreasingSubsequence(numbers));

