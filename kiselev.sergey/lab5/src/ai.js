import {findWinner, getEmptyCells} from './game.js';

function findFinishingMove(board, mark) {
  for (const index of getEmptyCells(board)) {
    const test = board.slice();
    test[index] = mark;

    if (findWinner(test) !== null) {
      return index;
    }
  }

  return null;
}

export function chooseComputerMove(board, mark) {
  const opponent = mark === 'X' ? 'O' : 'X';

  const winningMove = findFinishingMove(board, mark);

  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = findFinishingMove(board, opponent);

  if (blockingMove !== null) {
    return blockingMove;
  }

  if (board[4] === null) {
    return 4;
  }

  const empty = getEmptyCells(board);

  return empty[Math.floor(Math.random() * empty.length)];
}
