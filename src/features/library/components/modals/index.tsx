import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageContext } from "@/contexts/I18N";
import { PlusIcon } from "lucide-react";
import NewGameModalContent from "./modal";

const NewGame = () => {
  const { t } = useLanguageContext();

  return (
    <Tooltip delayDuration={500}>
      <Dialog>
        <TooltipTrigger asChild>
          <DialogTrigger>
            <Button variant={"ghost"} size={"icon"} className="relative group">
              <div className="w-full h-full rounded-md bg-gradient-to-tr from-blue-400 to-purple-400" />
              <div className="absolute inset-0 z-20 flex items-center justify-center transition-all opacity-100 bg-gradient-to-tl from-background to-transparent hover:opacity-85">
                <PlusIcon fill="white" />
              </div>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {t("new_game")}
        </TooltipContent>
        <NewGameModalContent />
      </Dialog>
    </Tooltip>
  );
};

export default NewGame;
