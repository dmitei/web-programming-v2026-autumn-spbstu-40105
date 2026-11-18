export function rotateArray(arr, steps) {
  if (!Number.isInteger(steps)) {
    throw new TypeError('steps must be an integer');
  }
  if (steps < 0) {
    throw new RangeError('steps must be non-negative');
  }

  const n = arr.length;
  if (n === 0) {
    return [];
  }

  const k = steps % n;

  return [...arr.slice(n - k), ...arr.slice(0, n - k)];
}
