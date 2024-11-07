import { invoke } from "@/lib";
import { Maximize2, MinusIcon, X } from "lucide-react";
import { Button } from "../ui/button";

const TitleBar = () => {
  return (
    <div className="fixed top-0 z-50 bg-background w-full h-8 overflow-hidden flex">
      <div className="flex flex-row w-full justify-between items-center">
        <div id="titlebar" className="flex-1 w-full h-full flex items-center">
          <h1 className="font-semibold ml-2 pointer-events-none">Falkor</h1>
        </div>
        <div className="flex gap-1 z-50 relative">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => invoke("app:minimize")}
            className="group"
          >
            <MinusIcon className="size-6 group-hover:text-yellow-400 transition-all" />
          </Button>

          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => invoke("app:maximize")}
            className="group"
          >
            <Maximize2 className="size-4 group-hover:text-green-400 transition-all" />
          </Button>

          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => invoke("app:close")}
            className="group"
          >
            <X className="size-6 group-hover:text-red-400 transition-all" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
