export default function HUD({ title, score, onBack }) {
  return (
    <div className="retro-hud">
      <button type="button" className="retro-btn retro-btn-back" onClick={onBack}>
        Back
      </button>
      <span className="retro-title">{title}</span>
      <span className="retro-score">Score: {score}s</span>
    </div>
  );
}