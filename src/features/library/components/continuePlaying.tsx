import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useGames } from "../hooks/useGames";
import { NewGameCard } from "./cards/newGame";
import GamesContainer from "./containers/games";
import NewGameModalContent from "./modals/modal";

const ContinuePlaying = () => {
  const { games } = useGames();

  console.log(games);

  const games_count = Object.values(games)?.length;

  if (games_count) return <GamesContainer games={games} />;

  return (
    <Dialog>
      <DialogTrigger>
        <NewGameCard />
      </DialogTrigger>

      <NewGameModalContent />
    </Dialog>
  );
};

export default ContinuePlaying;
