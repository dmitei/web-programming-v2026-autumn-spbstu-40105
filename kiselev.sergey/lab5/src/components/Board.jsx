import Cell from './Cell.jsx';

export default function Board({board, winningLine, onSelect}) {
  return (
    <div className="game-board" data-testid="game-board">
      {board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          highlighted={Boolean(winningLine?.includes(index))}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
