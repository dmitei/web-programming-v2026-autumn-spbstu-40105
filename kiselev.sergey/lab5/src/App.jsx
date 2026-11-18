import {useEffect, useState} from 'react';

import Board from './components/Board.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import {chooseComputerMove} from './ai.js';
import {
  createEmptyBoard,
  findWinner,
  getCurrentPlayer,
  getEmptyCells,
} from './game.js';

const COMPUTER_MARK = 'O';

const COMPUTER_DELAY = 500;

const SPLASH_DURATION = 1500;

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [mode, setMode] = useState('computer');
  const [splashVisible, setSplashVisible] = useState(true);

  const current = getCurrentPlayer(board);
  const winner = findWinner(board);
  const isDraw = winner === null && getEmptyCells(board).length === 0;
  const isFinished = winner !== null || isDraw;
  const isComputerTurn =
    mode === 'computer' && current === COMPUTER_MARK && !isFinished;

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isComputerTurn) {
      return undefined;
    }

    const timer = setTimeout(() => {
      const index = chooseComputerMove(board, COMPUTER_MARK);
      const next = board.slice();
      next[index] = COMPUTER_MARK;

      setBoard(next);
    }, COMPUTER_DELAY);

    return () => clearTimeout(timer);
  }, [isComputerTurn, board]);

  function handleSelect(index) {
    if (isFinished || isComputerTurn || board[index] !== null) {
      return;
    }

    const next = board.slice();
    next[index] = current;

    setBoard(next);
  }

  function handleRestart() {
    setBoard(createEmptyBoard());
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setBoard(createEmptyBoard());
  }

  let status = `Ходят ${current === 'X' ? 'крестики' : 'нолики'}`;

  if (winner !== null) {
    status = `Победили ${winner.mark === 'X' ? 'крестики' : 'нолики'}`;
  } else if (isDraw) {
    status = 'Ничья';
  } else if (isComputerTurn) {
    status = 'Компьютер думает';
  }

  return (
    <main className="app" data-testid="app">
      <h1 className="app-title">Крестики-нолики</h1>

      <p className="game-status" data-testid="game-status">
        {status}
      </p>

      <div className="mode-panel">
        <button
          type="button"
          className="mode-button"
          data-testid="mode-computer"
          aria-pressed={mode === 'computer'}
          onClick={() => handleModeChange('computer')}
        >
          С компьютером
        </button>
        <button
          type="button"
          className="mode-button"
          data-testid="mode-human"
          aria-pressed={mode === 'human'}
          onClick={() => handleModeChange('human')}
        >
          Вдвоём
        </button>
      </div>

      <div className="board-area">
        <Board
          board={board}
          winningLine={winner?.line}
          onSelect={handleSelect}
        />

        {isFinished && (
          <GameOverScreen winner={winner} onRestart={handleRestart} />
        )}
      </div>

      <button
        type="button"
        className="game-restart"
        data-testid="game-restart"
        onClick={handleRestart}
      >
        Новая игра
      </button>

      {splashVisible && (
        <SplashScreen onStart={() => setSplashVisible(false)} />
      )}
    </main>
  );
}
