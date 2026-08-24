import { useState } from "react";
import MainMenuPage from "./pages/MainMenuPage.jsx";
import MiniGamePage from "./pages/MiniGamePage.jsx";

export default function App() {
  const [view, setView] = useState("menu");

  if (view === "game") {
    return <MiniGamePage onBack={() => setView("menu")} />;
  }
  return <MainMenuPage onPlay={() => setView("game")} />;
}