export function countVowels(str) {
  let count = 0;
  const vowels = 'aeiouAEIOU';

  for (const char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return count;
}
