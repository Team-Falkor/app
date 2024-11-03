import { cn } from "@/lib/utils"; // If you're using shadcn's helper utility
import { Play, StopCircle } from "lucide-react";
import { usePlayGame } from "../../hooks/usePlayGame";

type ContinuePlayingCardProps = {
  game_name: string;
  bg_image: string; // Path to background image (either URL or local)
  game_path: string;
};

const ContinuePlayingCard = ({
  game_name,
  bg_image,
  game_path,
}: ContinuePlayingCardProps) => {
  const { gameRunning, playGame } = usePlayGame(game_path);

  // Determine if image path is a URL or a local file path
  const isRemoteImage = /^https?:\/\//i.test(bg_image);
  const realImagePath = isRemoteImage ? bg_image : `local:${bg_image}`;

  return (
    <button
      className={cn(
        "relative h-44 w-80 rounded-lg overflow-hidden shadow-lg bg-cover bg-center",
        {
          group: !gameRunning,
        }
      )}
      onClick={playGame}
      style={{
        backgroundImage: `url(${realImagePath})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 flex flex-col items-start justify-end p-3 z-10">
        <h3 className="text-secondary-foreground/80 text-sm group-hover:opacity-100 opacity-0 transition-all">
          {gameRunning ? "Stop Playing" : "Continue Playing"}
        </h3>
        <h2 className="text-white text-lg font-bold capitalize -mt-0.5 line-clamp-1">
          {game_name}
        </h2>
      </div>

      <div
        className={cn(
          "inset-0 z-20 absolute flex items-center justify-center transition-all",
          { "opacity-0 group-hover:opacity-100": !gameRunning }
        )}
      >
        {!gameRunning ? (
          <Play size={32} className="text-white" fill="white" />
        ) : (
          <StopCircle size={32} className="text-white" fill="white" />
        )}
      </div>
    </button>
  );
};

export default ContinuePlayingCard;
