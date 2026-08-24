import { useNavigate } from "react-router-dom";
import RetroRacer from "../components/RetroRacer/RetroRacer.jsx";
import "../components/RetroRacer/styles.css";

export default function Game() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <RetroRacer onBack={handleBack} />
      </div>
    </div>
  );
}
