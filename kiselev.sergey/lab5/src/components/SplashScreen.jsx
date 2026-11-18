export default function SplashScreen({onStart}) {
  return (
    <div className="splash" data-testid="game-splash" onClick={onStart}>
      <p className="splash-title">Крестики-нолики</p>
      <p className="splash-text">
        Три знака в ряд по горизонтали, вертикали или диагонали
      </p>
      <button
        type="button"
        className="splash-button"
        data-testid="splash-start"
        onClick={onStart}
      >
        Играть
      </button>
    </div>
  );
}
