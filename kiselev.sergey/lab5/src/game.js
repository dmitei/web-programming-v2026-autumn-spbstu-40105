export const WINNING_LINES = [
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

export function findWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;

    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return {mark: board[a], line};
    }
  }

  return null;
}

export function getEmptyCells(board) {
  const cells = [];

  board.forEach((cell, index) => {
    if (cell === null) {
      cells.push(index);
    }
  });

  return cells;
}

export function getCurrentPlayer(board) {
  const crosses = board.filter((cell) => cell === 'X').length;
  const noughts = board.filter((cell) => cell === 'O').length;

  return crosses === noughts ? 'X' : 'O';
}
