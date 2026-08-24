import { useEffect, useRef, useState } from "react";
import { CANVAS_W, CANVAS_H } from "./constants.js";
import { createGameEngine } from "./gameEngine.js";
import { loadBest } from "./best.js";
import { initSprites } from "./carSprite.js";
import StartScreen from "./StartScreen.jsx";
import GameOverScreen from "./GameOverScreen.jsx";
import HUD from "./HUD.jsx";
import "./styles.css";

const MOVE_LEFT_CODES = new Set(["ArrowLeft", "KeyA"]);
const MOVE_RIGHT_CODES = new Set(["ArrowRight", "KeyD"]);
const CONFIRM_CODES = new Set(["Enter", "Space"]);
const PAUSE_CODES = new Set(["KeyP", "Escape"]);
const ARROW_CODES = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

export default function RetroRacer({ onBack }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const modeRef = useRef("start");
  const backGuardRef = useRef(false);

  const [mode, setMode] = useState("start");
  const [score, setScore] = useState("0.0");
  const [finalScore, setFinalScore] = useState("0.0");
  const [best, setBest] = useState(() => loadBest());
  const [isNewBest, setIsNewBest] = useState(false);

  modeRef.current = mode;

  useEffect(() => {
    initSprites();
    const canvas = canvasRef.current;
    const engine = createGameEngine(canvas, {
      onScoreChange: (value) => setScore(value),
      onGameOver: (elapsed, newBest, newRecord) => {
        setFinalScore(elapsed.toFixed(1));
        setBest(newBest);
        setIsNewBest(newRecord);
        setMode("gameover");
      },
    });
    engineRef.current = engine;
    engine.startLoop();

    const handleKeyDown = (event) => {
      if (ARROW_CODES.has(event.code)) event.preventDefault();

      const currentMode = modeRef.current;

      if (MOVE_LEFT_CODES.has(event.code)) {
        event.preventDefault();
        engine.move(-1);
        return;
      }
      if (MOVE_RIGHT_CODES.has(event.code)) {
        event.preventDefault();
        engine.move(1);
        return;
      }
      if (PAUSE_CODES.has(event.code) && (currentMode === "playing" || currentMode === "paused")) {
        event.preventDefault();
        engine.togglePause();
        setMode((prev) => (prev === "playing" ? "paused" : "playing"));
        return;
      }
      if (CONFIRM_CODES.has(event.code)) {
        event.preventDefault();
        if (currentMode === "start" || currentMode === "gameover") {
          engine.start();
          setScore("0.0");
          setFinalScore("0.0");
          setIsNewBest(false);
          setMode("playing");
        }
      }
    };

    const handleBlur = () => {
      if (modeRef.current === "playing") {
        engine.togglePause();
        setMode("paused");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleStart = () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.start();
    setScore("0.0");
    setFinalScore("0.0");
    setIsNewBest(false);
    setMode("playing");
  };

  const handleRestart = () => {
    handleStart();
  };

  const handleBack = () => {
    if (backGuardRef.current) return;
    backGuardRef.current = true;
    const engine = engineRef.current;
    if (engine) engine.destroy();
    onBack();
  };

  return (
    <div className="retro-racer-root">
      <HUD title="RETRO RACER" score={score} onBack={handleBack} />
      <div className="retro-game-area">
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />
        {mode === "start" && <StartScreen best={best} onStart={handleStart} />}
        {mode === "gameover" && (
          <GameOverScreen
            finalScore={finalScore}
            best={best}
            isNewBest={isNewBest}
            onRestart={handleRestart}
            onBack={handleBack}
          />
        )}
        {mode === "paused" && (
          <div className="retro-overlay">
            <h2 className="retro-overlay-title">PAUSED</h2>
            <p className="retro-final-score">Score: {score}s</p>
            <p className="retro-instructions retro-instructions-dim">Press P or Escape to resume</p>
          </div>
        )}
      </div>
    </div>
  );
}