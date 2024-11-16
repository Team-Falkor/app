import { Tab } from "@/@types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewListDialogContent from "@/features/lists/components/newListDialogContent";
import { cn } from "@/lib";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import NewGameModal from "../modals/newGame";

interface LibraryTabsProps {
  tabs: Array<Tab>;
  activeTab: Tab | undefined;
  setActiveTab: Dispatch<SetStateAction<Tab | undefined>>;
}

const LibraryTabs = ({ tabs, activeTab, setActiveTab }: LibraryTabsProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2.5 p-4 bg-background">
      {/* New Game Button */}
      <Dialog>
        <DialogTrigger>
          <Button
            variant="secondary"
            className="mr-1 text-white bg-gradient-to-tr from-blue-400 to-purple-400 rounded-xl gap-1.5"
          >
            <Plus strokeWidth={3} />
            <span className="font-bold">New Game</span>
          </Button>
        </DialogTrigger>
        <NewGameModal />
      </Dialog>

      {/* Tabs */}
      {tabs.map((tab, i) => (
        <Button
          variant="secondary"
          key={i}
          className={cn(
            "rounded-xl gap-1.5 font-semibold transition-all duration-75",
            {
              "ring-2 ring-purple-400 ring-opacity-65 bg-purple-400/20":
                activeTab?.name === tab.name,
            }
          )}
          onClick={() => setActiveTab(tab)}
        >
          {tab.name}
        </Button>
      ))}

      {/* New List Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="secondary" className="rounded-xl gap-1.5 ml-1">
            <Plus strokeWidth={3} />
            <span className="font-bold">New List</span>
          </Button>
        </DialogTrigger>
        <NewListDialogContent open={open} setOpen={setOpen} />
      </Dialog>
    </div>
  );
};

export default LibraryTabs;
