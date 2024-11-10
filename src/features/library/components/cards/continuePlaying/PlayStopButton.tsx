import { cn } from "@/lib";
import { Play } from "lucide-react";
import { MdStop } from "react-icons/md";

interface PlayStopButtonProps {
  isPlaying: boolean;
  playGame: () => void;
  stopGame: () => void;
}

const PlayStopButton: React.FC<PlayStopButtonProps> = ({
  isPlaying,
  playGame,
  stopGame,
}) => (
  <button
    className={cn("flex items-center justify-center transition-all", {
      "opacity-0 group-hover:opacity-100": !isPlaying,
    })}
    onClick={isPlaying ? stopGame : playGame}
  >
    {isPlaying ? (
      <MdStop size={40} className="text-white" fill="white" />
    ) : (
      <Play size={32} className="text-white" fill="white" />
    )}
  </button>
);

export default PlayStopButton;
