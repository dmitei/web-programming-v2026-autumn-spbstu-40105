function Splash({hidden, onDismiss}) {
  return (
    <div
      className={`splash${hidden ? ' splash-hidden' : ''}`}
      data-testid="splash-screen"
      onClick={onDismiss}
    >
      <h1>Крестики-нолики</h1>
      <p>Нажмите в любом месте, чтобы начать</p>
    </div>
  );
}

export default Splash;
