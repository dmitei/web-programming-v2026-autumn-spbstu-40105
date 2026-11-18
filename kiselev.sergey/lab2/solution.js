export function formatPhoneNumber(phoneStr) {
  const digits = String(phoneStr);

  const code = digits.slice(0, 3);
  const num1 = digits.slice(3, 6);
  const num2 = digits.slice(6, 8);
  const num3 = digits.slice(8, 10);

  return `+7 (${code}) ${num1}-${num2}-${num3}`;
}
