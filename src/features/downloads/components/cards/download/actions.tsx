import { DownloadData } from "@/@types";
import { ITorrent } from "@/@types/torrent";
import { Button } from "@/components/ui/button";
import { UseDownloadAction } from "@/features/downloads/hooks/useDownloadAction";
import { isTorrent } from "@/lib";
import { Pause, Play } from "lucide-react";
import { MdStop } from "react-icons/md";

// TODO: fix if download pause and resume not updating ui

interface DownloadCardActionsProps {
  stats: ITorrent | DownloadData;
  deleteStats: (id: string) => void;
  isPaused?: boolean;
}

const DownloadCardActions = ({
  stats,
  deleteStats,
  isPaused,
}: DownloadCardActionsProps) => {
  const isTorrentType = isTorrent(stats);

  const { pauseDownload, startDownload, stopDownload, status } =
    UseDownloadAction(isTorrentType ? stats.infoHash : stats.id, isTorrentType);

  if (status === "stopped" || !stats) return null;

  console.log("status", stats.status);

  return (
    <div className="flex flex-row gap-4">
      {isPaused ? (
        <Button
          size="default"
          variant="secondary"
          className="gap-2"
          onClick={startDownload ?? undefined}
        >
          <Play fill="currentColor" />
          Start Download
        </Button>
      ) : (
        <Button
          size="default"
          variant="secondary"
          className="gap-2"
          onClick={pauseDownload ?? undefined}
        >
          <Pause fill="currentColor" />
          Pause Download
        </Button>
      )}

      <Button
        size="icon"
        variant="destructive"
        className="p-0.5"
        onClick={() => {
          stopDownload();
          deleteStats(isTorrentType ? stats.infoHash : stats.id);
        }}
      >
        <MdStop size="fill" />
      </Button>
    </div>
  );
};

export default DownloadCardActions;
