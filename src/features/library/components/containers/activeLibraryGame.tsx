import { useGames } from "../../hooks/useGames";
import ContinuePlayingCard from "../cards/continuePlaying";

const ActiveLibraryGame = () => {
  const { fetchGames, deleteGame, updateGame, games } = useGames(true);

  return (
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
  );
};

export default ActiveLibraryGame;
