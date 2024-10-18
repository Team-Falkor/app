import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { MdStop } from "react-icons/md";

type Props = {
  downloading: boolean;
  stopDownload: () => void;
  pauseDownload: () => void;
  startDownload: () => void;
};

const DownloadCardActions = ({
  downloading,
  pauseDownload,
  startDownload,
  stopDownload,
}: Props) => {
  return (
    <div className="flex flex-row gap-4">
      {!downloading ? (
        <Button
          size={"default"}
          variant={"secondary"}
          className="gap-2"
          onClick={startDownload}
        >
          <Play fill="currentcolor" />
          Start Download
        </Button>
      ) : (
        <Button
          size={"default"}
          variant={"secondary"}
          className="gap-2"
          onClick={pauseDownload}
        >
          <Pause fill="currentcolor" />
          Pause Download
        </Button>
      )}

      <Button
        size={"icon"}
        className="p-0.5"
        variant={"destructive"}
        onClick={stopDownload}
      >
        <MdStop size={"fill"} />
      </Button>
    </div>
  );
};

export default DownloadCardActions;
