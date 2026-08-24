import RetroRacer from "../components/RetroRacer/RetroRacer.jsx";

export default function MiniGamePage({ onBack }) {
  return (
    <main className="page">
      <RetroRacer onBack={onBack} />
    </main>
  );
}