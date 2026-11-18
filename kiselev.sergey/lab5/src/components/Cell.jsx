export default function Cell({index, value, highlighted, onSelect}) {
  const classNames = ['game-cell'];

  if (highlighted) {
    classNames.push('game-cell-win');
  }

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      data-testid="game-cell"
      aria-label={`Клетка ${index + 1}`}
      onClick={() => onSelect(index)}
    >
      {value}
    </button>
  );
}
