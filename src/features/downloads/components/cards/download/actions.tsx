import { Button } from "@/components/ui/button";
import { UseDownloadAction } from "@/features/downloads/hooks/useDownloadAction";
import { Torrent } from "@/stores/downloads";
import { Pause, Play } from "lucide-react";
import { MdStop } from "react-icons/md";

type Props = {
  stats: Torrent | null;
};

const DownloadCardActions = ({ stats }: Props) => {
  const { pauseDownload, startDownload, stopDownload, status } =
    UseDownloadAction(stats?.infoHash);

  if (status === "deleted") return null;
  if (!stats) return;

  return (
    <div className="flex flex-row gap-4">
      {status === "paused" || stats.paused ? (
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
