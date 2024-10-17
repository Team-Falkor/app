import { Button } from "@/components/ui/button";
import { PlayIcon, StopCircle } from "lucide-react";

const DownloadCardActions = () => {
  return (
    <div className="flex flex-row gap-2.5">
      <Button size={"icon"} variant={"ghost"} className="size-8 *:size-6">
        <PlayIcon />
      </Button>

      <Button size={"icon"} variant={"ghost"} className="size-8 *:size-6">
        <StopCircle />
      </Button>
    </div>
  );
};

export default DownloadCardActions;
