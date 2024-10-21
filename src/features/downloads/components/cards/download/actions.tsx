import { Button } from "@/components/ui/button";
import { UseDownloadAction } from "@/features/downloads/hooks/useDownloadAction";
import { Torrent } from "@/stores/downloads";
import { Pause, Play } from "lucide-react";
import { useMemo } from "react";
import { MdStop } from "react-icons/md";

type Props = {
  stats: Torrent | null;
};

const DownloadCardActions = ({ stats }: Props) => {
  const { pauseDownload, startDownload, stopDownload, status } =
    UseDownloadAction(stats?.infoHash);

  const actionButtons = useMemo(() => {
    return (
      <div className="flex flex-row gap-4">
        {status === "paused" || stats?.paused ? (
          <Button
            size="default"
            variant="secondary"
            className="gap-2"
            onClick={startDownload}
          >
            <Play fill="currentColor" />
            Start Download
          </Button>
        ) : (
          <Button
            size="default"
            variant="secondary"
            className="gap-2"
            onClick={pauseDownload}
          >
            <Pause fill="currentColor" />
            Pause Download
          </Button>
        )}

        <Button
          size="icon"
          variant="destructive"
          className="p-0.5"
          onClick={stopDownload}
        >
          <MdStop size="fill" />
        </Button>
      </div>
    );
  }, [status, stats?.paused, startDownload, pauseDownload, stopDownload]);

  if (status === "deleted" || !stats) return null;

  return actionButtons;
};

export default DownloadCardActions;
