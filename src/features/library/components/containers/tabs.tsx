import { Tab } from "@/@types";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewListDialogContent from "@/features/lists/components/newListDialogContent";
import useGamepadButton from "@/hooks/useGamepadButton";
import { cn } from "@/lib";
import { Plus } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import NewGameModal from "../modals/newGame";

interface LibraryTabsProps {
  tabs: Array<Tab>;
  activeTab: Tab | undefined;
  setActiveTab: Dispatch<SetStateAction<Tab | undefined>>;
}

const LibraryTabs = ({ tabs, activeTab, setActiveTab }: LibraryTabsProps) => {
  const [open, setOpen] = useState(false);

  const activeTabIndex = useMemo(
    () => tabs.findIndex((tab) => tab.name === activeTab?.name),
    [tabs, activeTab]
  );

  const switchToNextTab = useCallback(() => {
    if (!tabs.length) return;

    const nextIndex = (activeTabIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
    toast.success(`Switched to next tab: ${tabs[nextIndex].name}`);
  }, [tabs, activeTabIndex, setActiveTab]);

  const switchToPreviousTab = useCallback(() => {
    if (!tabs.length) return;

    const previousIndex = (activeTabIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[previousIndex]);
    toast.success(`Switched to previous tab: ${tabs[previousIndex].name}`);
  }, [tabs, activeTabIndex, setActiveTab]);

  useGamepadButton("LB", switchToNextTab);
  useGamepadButton("RB", switchToPreviousTab);

  return (
    <div className="flex p-4 bg-background">
      {/* New Game Button */}
      <Dialog>
        <DialogTrigger>
          <Button
            variant="secondary"
            className="text-white bg-gradient-to-tr from-blue-400 to-purple-400 rounded-xl gap-1.5"
          >
            <Plus strokeWidth={3} />
            <span className="font-bold">New Game</span>
          </Button>
        </DialogTrigger>
        <NewGameModal />
      </Dialog>

      {/* Tabs */}
      <Carousel
        className="flex-1 mx-3"
        opts={{
          skipSnaps: true,
          dragFree: true,
          loop: false,
        }}
      >
        <CarouselContent>
          {tabs.map((tab, i) => (
            <CarouselItem key={i} className="basis-auto ">
              <Button
                variant="secondary"
                key={i}
                className={cn(
                  "rounded-xl gap-1.5 font-semibold transition-all duration-75",
                  {
                    "bg-purple-400/20": activeTab?.name === tab.name,
                  }
                )}
                onClick={() => setActiveTab(tab)}
              >
                {tab.name}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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
