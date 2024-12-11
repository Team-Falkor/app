import { DownloadData, QueueData } from "@/@types";
import { ITorrent } from "@/@types/torrent";
import FolderButton from "@/components/folderButton";
import { useLanguageContext } from "@/contexts/I18N";
import DownloadCard from "@/features/downloads/components/cards/download";
import { DownloadCardLoading } from "@/features/downloads/components/cards/loading";
import DownloadQueuedCard from "@/features/downloads/components/cards/queued";
import UseDownloads from "@/features/downloads/hooks/useDownloads";
import { useMapState } from "@/hooks";
import { isTorrent } from "@/lib";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";

export const Route = createLazyFileRoute("/downloads")({
  component: Downloads,
});

function Downloads() {
  const { t } = useLanguageContext();
  const { downloads, queue } = UseDownloads();
  const {
    map: statsMap,
    set: setStats,
    remove: removeStats,
  } = useMapState<string, ITorrent | DownloadData>();

  const handleProgress = useCallback(
    (_event: any, data: ITorrent | DownloadData) => {
      if (isTorrent(data)) {
        setStats(data.infoHash, data);
      } else {
        setStats(data.id, data);
      }
    },
    [setStats]
  );

  // Register progress event listener
  useEffect(() => {
    const ipcRenderer = window.ipcRenderer;
    ipcRenderer.on("torrent:progress", handleProgress);

    return () => {
      ipcRenderer.removeAllListeners("torrent:progress");
    };
  }, [handleProgress]);

  // Combine downloading and queue, removing duplicates by ID/infoHash
  const uniqueDownloads = useMemo(() => {
    const uniqueSet = new Map<string, ITorrent | DownloadData | QueueData>();

    for (const item of [...downloads, ...queue]) {
      if ("type" in item) {
        uniqueSet.set(
          item.type === "torrent" ? item.data.torrentId : item.data.id,
          item
        );
      } else {
        uniqueSet.set(isTorrent(item) ? item.infoHash : item.id, item);
      }
    }

    return Array.from(uniqueSet.values());
  }, [downloads, queue]);

  const renderDownloadCard = useCallback(
    (item: ITorrent | DownloadData | QueueData) => {
      const stats: ITorrent | DownloadData | QueueData | undefined =
        "type" in item
          ? item
          : statsMap.get(isTorrent(item) ? item.infoHash : item.id);

      // if ((stats && stats.status === "stopped") || stats?.status === "error")
      //   return null;

      if (!stats) return null;

      if ("type" in stats) {
        return (
          <DownloadQueuedCard
            key={
              stats.type === "torrent" ? stats.data.torrentId : stats.data.id
            }
            stats={stats}
          />
        );
      }

      if (stats?.status === "pending") return <DownloadCardLoading />;
      if (isTorrent(stats))
        return (
          <DownloadCard
            key={stats.infoHash}
            stats={stats}
            deleteStats={removeStats}
          />
        );
      return (
        <DownloadCard key={stats.id} stats={stats} deleteStats={removeStats} />
      );
    },
    [removeStats, statsMap]
  );

  return (
    <div className="flex flex-col w-full h-full">
      {/* ACTION BAR */}
      <div className="w-full flex justify-between flex-row bg-background/50 border-b mb-5 p-4 py-2.5">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">
            {t("sections.downloads")}
          </h1>
        </div>

        <div>
          <FolderButton
            path="downloads"
            tooltip={t("open_downloads_folder")}
            variant={"secondary"}
          />
        </div>
      </div>

      {uniqueDownloads.length ? (
        <div className="flex flex-col gap-4 mt-2 ">
          {uniqueDownloads.map(renderDownloadCard)}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-60 bg-muted/50">
          <h1 className="text-xl font-bold text-foreground">
            {t("no_downloads_in_progress")}
          </h1>
        </div>
      )}
    </div>
  );
}

export default Downloads;
