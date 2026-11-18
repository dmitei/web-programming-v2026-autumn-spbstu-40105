function GameOverScreen({isOver, winner, onRestart}) {
  let statusText = 'Игра продолжается';
  if (isOver) {
    statusText = winner ? `Победил игрок: ${winner}` : 'Ничья';
  }

  return (
    <>
      <h2>{statusText}</h2>
      <button type="button" data-testid="game-restart" onClick={onRestart}>
        Играть снова
      </button>
    </>
  );
}

export default GameOverScreen;
