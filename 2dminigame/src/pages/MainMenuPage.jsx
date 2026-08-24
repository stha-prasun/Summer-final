export default function MainMenuPage({ onPlay }) {
  return (
    <main className="page site-menu">
      <h1 className="site-menu-title">WHEELSRUS</h1>
      <p className="site-menu-tagline">A Hot Wheels-style toy shop</p>
      <button type="button" className="site-menu-btn" onClick={onPlay}>
        Play Mini Game
      </button>
      <p className="site-menu-hint">Psst... there&apos;s a hidden arcade bonus in here.</p>
    </main>
  );
}