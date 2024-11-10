import { LibraryGame, LibraryGameUpdate } from "@/@types/library/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLanguageContext } from "@/contexts/I18N";
import UpdateGameForm from "@/features/library/components/updateForm";

interface UpdateDialogProps {
  updateGame: (gameId: string, updates: LibraryGameUpdate) => void;
  fetchGames: () => void;
  game: LibraryGame;
}

const UpdateDialog = ({ fetchGames, updateGame, game }: UpdateDialogProps) => {
  const { t } = useLanguageContext();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {t("update")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <UpdateGameForm
          onSubmit={(values) => {
            updateGame(game.game_id, {
              game_args: values.gameArgs,
              game_command: values.gameCommand,
              game_icon: values.gameIcon,
              game_name: values.gameName,
              game_path: values.gamePath,
            });
            fetchGames();
            return;
          }}
          defaultValues={{
            gameArgs: game.game_args,
            gameCommand: game.game_command,
            gameName: game.game_name,
            gamePath: game.game_path,
            gameIcon: game.game_icon ?? "",
            gameId: game.game_id,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
