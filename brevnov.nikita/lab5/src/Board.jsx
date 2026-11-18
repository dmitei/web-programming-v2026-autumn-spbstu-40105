function Board({board, onCellClick}) {
  return (
    <div className="board" data-testid="game-board">
      {board.map((cell, index) => (
        <button
          key={index}
          type="button"
          className="board-cell"
          data-testid="game-cell"
          onClick={() => onCellClick(index)}
          disabled={cell !== null}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

export default Board;
