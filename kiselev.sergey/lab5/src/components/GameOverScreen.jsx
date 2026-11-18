export default function GameOverScreen({winner, onRestart}) {
  let title = 'Ничья';

  if (winner !== null) {
    title = `Победили ${winner.mark === 'X' ? 'крестики' : 'нолики'}`;
  }

  return (
    <div className="game-over" data-testid="game-result">
      <p className="game-over-title">{title}</p>
      <button
        type="button"
        className="game-over-button"
        data-testid="play-again"
        onClick={onRestart}
      >
        Играть снова
      </button>
    </div>
  );
}
