import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguageContext } from "@/contexts/I18N";
import NewGameForm from "./form";

const NewGameModalContent = () => {
  const { t } = useLanguageContext();

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>{t("new_game")}</DialogTitle>
        <DialogDescription>{t("new_game_modal_description")}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-2">
        <NewGameForm />
      </div>
    </DialogContent>
  );
};

export default NewGameModalContent;
