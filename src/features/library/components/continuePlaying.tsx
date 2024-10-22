import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useMemo } from "react";
import { useGames } from "../hooks/useGames";
import { NewGameCard } from "./cards/newGame";
import GamesContainer from "./containers/games";
import NewGameModalContent from "./modals/modal";

const ContinuePlaying = () => {
  const { games } = useGames();

  const games_count = useMemo(() => Object.values(games)?.length, [games]);

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
