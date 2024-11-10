import { LibraryGame, LibraryGameUpdate } from "@/@types/library/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import DeleteDialog from "./delete";
import UpdateDialog from "./edit";
import { useLanguageContext } from "@/contexts/I18N";

interface ContinuePlayingCardActionsProps {
  deleteGame: (gameId: string) => void;
  updateGame: (gameId: string, updates: LibraryGameUpdate) => void;
  fetchGames: () => void;
  game: LibraryGame;
}

const ContinuePlayingCardActions = ({
  deleteGame,
  updateGame,
  game,
  fetchGames,
}: ContinuePlayingCardActionsProps) => {
  const { t } = useLanguageContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="relative z-50 h-full w-7"
        >
          <Ellipsis size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-24" align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <UpdateDialog
          updateGame={updateGame}
          fetchGames={fetchGames}
          game={game}
        />

        <DeleteDialog
          deleteGame={() => deleteGame(game.game_id)}
          fetchGames={fetchGames}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContinuePlayingCardActions;
