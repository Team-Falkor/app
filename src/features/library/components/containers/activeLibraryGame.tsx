import { useMemo } from "react";
import { useGames } from "../../hooks/useGames";
import ContinuePlayingCard from "../cards/continuePlaying";

const ActiveLibraryGame = () => {
  const { fetchGames, deleteGame, updateGame, games } = useGames(true);

  const gamesCount = useMemo(() => Object.values(games)?.length, [games]);

  return (
    <div className="flex flex-wrap gap-4">
      {gamesCount ? (
        Object.values(games).map((game) => (
          <ContinuePlayingCard
            key={game.id}
            bg_image={game.game_icon ?? ""}
            game={game}
            fetchGames={fetchGames}
            deleteGame={deleteGame}
            updateGame={updateGame}
          />
        ))
      ) : (
        <div className="text-lg font-bold text-center">
          You have not added any games to continue playing
        </div>
      )}
    </div>
  );
};

export default ActiveLibraryGame;
