export default function GameOverScreen({ finalScore, best, isNewBest, onRestart, onBack }) {
  return (
    <div className="retro-overlay">
      <h2 className="retro-overlay-title retro-overlay-title-danger">GAME OVER</h2>
      <p className="retro-final-score">Score: {finalScore}s</p>
      {isNewBest && <p className="retro-new-best">NEW BEST!</p>}
      {!isNewBest && best > 0 && <p className="retro-best">Best: {best}s</p>}
      <div className="retro-overlay-row">
        <button type="button" className="retro-btn retro-btn-primary" onClick={onRestart}>
          Restart
        </button>
        <button type="button" className="retro-btn" onClick={onBack}>
          Back to Menu
        </button>
      </div>
      <p className="retro-instructions retro-instructions-dim">Enter / Space or R to restart</p>
    </div>
  );
}