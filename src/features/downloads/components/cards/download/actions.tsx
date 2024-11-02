import { DownloadData } from "@/@types";
import { ITorrent } from "@/@types/torrent";
import { Button } from "@/components/ui/button";
import { UseDownloadAction } from "@/features/downloads/hooks/useDownloadAction";
import { isTorrent } from "@/lib";
import { Pause, Play } from "lucide-react";
import { MdStop } from "react-icons/md";

const DownloadCardActions = (stats: ITorrent | DownloadData) => {
  const isTorrentType = isTorrent(stats);

  // Call UseDownloadAction with appropriate id and isTorrent flag
  const { pauseDownload, startDownload, stopDownload, status } =
    UseDownloadAction(isTorrentType ? stats.infoHash : stats.id, isTorrentType);

  // Return null if status indicates deletion or if there's no valid action available
  if (status === "deleted" || !stats) return null;

  return (
    <div className="flex flex-row gap-4">
      {(isTorrentType && !stats.paused) || status === "paused" ? (
        <Button
          size="default"
          variant="secondary"
          className="gap-2"
          onClick={startDownload ?? undefined} // Define onClick only when startDownload is available
        >
          <Play fill="currentColor" />
          Start Download
        </Button>
      ) : (
        <Button
          size="default"
          variant="secondary"
          className="gap-2"
          onClick={pauseDownload ?? undefined} // Define onClick only when pauseDownload is available
        >
          <Pause fill="currentColor" />
          Pause Download
        </Button>
      )}

      <Button
        size="icon"
        variant="destructive"
        className="p-0.5"
        onClick={stopDownload ?? undefined} // Define onClick only when stopDownload is available
      >
        <MdStop size="fill" />
      </Button>
    </div>
  );
};

export default DownloadCardActions;
