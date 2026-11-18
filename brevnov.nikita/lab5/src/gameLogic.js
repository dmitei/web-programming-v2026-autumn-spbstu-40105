const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createEmptyBoard() {
  return Array(9).fill(null);
}

export function calculateWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

export function getRandomComputerMove(board) {
  const availableIndexes = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null);

  if (availableIndexes.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableIndexes.length);
  return availableIndexes[randomIndex];
}
