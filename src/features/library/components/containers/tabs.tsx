import { Tab } from "@/@types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface LibraryTabsProps {
  tabs: Array<Tab>;
  activeTab: Tab | undefined;
  setActiveTab: Dispatch<SetStateAction<Tab | undefined>>;
}

const LibraryTabs = ({ tabs, activeTab, setActiveTab }: LibraryTabsProps) => {
  return (
    <div className="flex gap-2.5 p-4 bg-background">
      {/* New Game Button */}
      <Button
        variant="secondary"
        className="mr-1 text-white bg-gradient-to-tr from-blue-400 to-purple-400 rounded-xl gap-1.5"
      >
        <Plus strokeWidth={3} />
        <span className="font-bold">New Game</span>
      </Button>

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
      <Button variant="secondary" className="rounded-xl gap-1.5 ml-1">
        <Plus strokeWidth={3} />
        <span className="font-bold">New List</span>
      </Button>
    </div>
  );
};

export default LibraryTabs;
