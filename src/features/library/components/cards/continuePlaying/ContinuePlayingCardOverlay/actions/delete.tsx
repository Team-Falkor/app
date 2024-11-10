import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLanguageContext } from "@/contexts/I18N";
import { DialogClose } from "@radix-ui/react-dialog";

interface DeleteDialogProps {
  deleteGame: () => void;
  fetchGames: () => void;
}

const DeleteDialog = ({ deleteGame, fetchGames }: DeleteDialogProps) => {
  const { t } = useLanguageContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {t("delete")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you absolutely sure you want to
            delete this game?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button
              type="submit"
              variant={"secondary"}
              onClick={async () => {
                await deleteGame();
                await fetchGames();
              }}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
