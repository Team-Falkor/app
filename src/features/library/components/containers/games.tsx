import ContinuePlayingCard from "../cards/continuePlaying";

const GamesContainer = ({ games }: { games: Record<string, any> }) => {
  return (
    <div>
      {Object.values(games).map((game) => (
        <ContinuePlayingCard
          key={game.id}
          game_name={game.game_name}
          bg_image={game.game_icon}
          game_path={game.game_path}
        />
      ))}
    </div>
  );
};

export default GamesContainer;
