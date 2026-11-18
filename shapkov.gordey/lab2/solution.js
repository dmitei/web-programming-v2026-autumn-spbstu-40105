export function analyzieString(str) {
  let letters = 0;
  let digits = 0;
  let spaces = 0;
  let other = 0;

  for (const char of str) {
    if (char === ' ') {
      spaces++;
    } else if (char >= '0' && char <= '9') {
      digits++;
    } else if (/^\p{L}$/u.test(char)) {
      letters++;
    } else {
      other++;
    }
  }
  return {letters, digits, spaces, other};
}
