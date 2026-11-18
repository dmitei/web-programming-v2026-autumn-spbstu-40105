export function findMaxSubarraySum(arr, n) {
  if (n > arr.length) {
    throw new Error('n should not be greater then array length');
  }

  let curSum = 0;
  for (let i = 0; i < n; i++) {
    curSum += arr[i];
  }

  let maxSum = curSum;
  for (let i = n; i < arr.length; i++) {
    curSum = curSum + arr[i] - arr[i - n];
    if (curSum > maxSum) {
      maxSum = curSum;
    }
  }

  return maxSum;
}
