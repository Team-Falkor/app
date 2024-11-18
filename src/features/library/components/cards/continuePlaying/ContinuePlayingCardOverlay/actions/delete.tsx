import Confirmation from "@/components/confirmation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLanguageContext } from "@/contexts/I18N";

interface DeleteDialogProps {
  deleteGame: () => void;
  fetchGames: () => void;
}

const DeleteDialog = ({ deleteGame, fetchGames }: DeleteDialogProps) => {
  const { t } = useLanguageContext();

  return (
    <Confirmation
      onConfirm={async () => {
        await deleteGame();
        await fetchGames();
      }}
    >
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        {t("delete")}
      </DropdownMenuItem>
    </Confirmation>
  );
};

export default DeleteDialog;
