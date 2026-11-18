import {useEffect, useState} from 'react';
import Splash from './Splash.jsx';
import Board from './Board.jsx';
import GameOverScreen from './GameOverScreen.jsx';
import {
  createEmptyBoard,
  calculateWinner,
  isBoardFull,
  getRandomComputerMove,
} from './gameLogic.js';

const INTRO_DURATION_MS = 1200;

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [mode, setMode] = useState('player');
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, []);

  function dismissIntro() {
    setShowIntro(false);
  }

  function restart() {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setWinner(null);
    setIsOver(false);
  }

  function selectMode(selectedMode) {
    setMode(selectedMode);
    restart();
  }

  function handleCellClick(index) {
    if (isOver || board[index] !== null) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);

    const nextWinner = calculateWinner(nextBoard);
    if (nextWinner || isBoardFull(nextBoard)) {
      setWinner(nextWinner);
      setIsOver(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }

  useEffect(() => {
    if (isOver || mode !== 'computer' || currentPlayer !== 'O') {
      return;
    }

    const timeoutId = setTimeout(() => {
      const computerMoveIndex = getRandomComputerMove(board);
      if (computerMoveIndex === null) {
        return;
      }

      const nextBoard = [...board];
      nextBoard[computerMoveIndex] = 'O';
      setBoard(nextBoard);

      const nextWinner = calculateWinner(nextBoard);
      if (nextWinner || isBoardFull(nextBoard)) {
        setWinner(nextWinner);
        setIsOver(true);
        return;
      }

      setCurrentPlayer('X');
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [board, currentPlayer, mode, isOver]);

  const computerButtonClassName =
    mode === 'computer'
      ? 'mode-switch-button mode-switch-button-active'
      : 'mode-switch-button';
  const playerButtonClassName =
    mode === 'player'
      ? 'mode-switch-button mode-switch-button-active'
      : 'mode-switch-button';

  return (
    <main data-testid="app" className="app">
      <Splash hidden={!showIntro} onDismiss={dismissIntro} />

      <div className="game">
        <div className="mode-switch">
          <button
            type="button"
            data-testid="start-vs-computer"
            className={computerButtonClassName}
            onClick={() => selectMode('computer')}
          >
            Против компьютера
          </button>
          <button
            type="button"
            data-testid="start-vs-player"
            className={playerButtonClassName}
            onClick={() => selectMode('player')}
          >
            Против другого игрока
          </button>
        </div>

        <p className="current-player">Ход игрока: {currentPlayer}</p>
        <Board board={board} onCellClick={handleCellClick} />

        <div className="game-over" data-testid="game-over-screen">
          <GameOverScreen isOver={isOver} winner={winner} onRestart={restart} />
        </div>
      </div>
    </main>
  );
}

export default App;
