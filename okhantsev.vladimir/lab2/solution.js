export function reverseWords(str) {
  const words = [];
  for (const word of str.split(/\s+/)) {
    words.push(word.split('').reverse().join(''));
  }

  return words.join(' ');
}
