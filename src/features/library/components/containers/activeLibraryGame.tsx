import { useMemo } from "react";
import { useGames } from "../../hooks/useGames";
import ContinuePlayingCard from "../cards/continuePlaying";

const ActiveLibraryGame = () => {
  const { fetchGames, deleteGame, updateGame, games } = useGames(true);

  const gamesCount = useMemo(() => Object.values(games)?.length, [games]);

  return gamesCount ? (
    <div className="flex flex-wrap gap-4">
      {Object.values(games).map((game) => (
        <ContinuePlayingCard
          key={game.id}
          bg_image={game.game_icon ?? ""}
          game={game}
          fetchGames={fetchGames}
          deleteGame={deleteGame}
          updateGame={updateGame}
        />
      ))}
    </div>
  ) : (
    <p className="text-lg font-semibold">
      You have not added any games to continue playing.
    </p>
  );
};

export default ActiveLibraryGame;
