export function runLengthEncode(input) {
  if (input.length === 0) {
    return '';
  }

  let result = '';
  let currentChar = input[0];
  let count = 1;

  for (let i = 1; i < input.length; i += 1) {
    const char = input[i];

    if (char === currentChar) {
      count += 1;
    } else {
      result += `${count}${currentChar}`;
      currentChar = char;
      count = 1;
    }
  }

  result += `${count}${currentChar}`;

  return result;
}
