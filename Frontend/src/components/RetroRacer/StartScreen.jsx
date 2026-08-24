export default function StartScreen({ best, onStart }) {
  return (
    <div className="retro-overlay">
      <h1 className="retro-overlay-title">RETRO RACER</h1>
      {best > 0 && <p className="retro-best">Best: {best}s</p>}
      <button type="button" className="retro-btn retro-btn-primary" onClick={onStart}>
        Start
      </button>
      <p className="retro-instructions">ArrowLeft / ArrowRight or A / D to move</p>
      <p className="retro-instructions retro-instructions-dim">Enter / Space to start</p>
    </div>
  );
}