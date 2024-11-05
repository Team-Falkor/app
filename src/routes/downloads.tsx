import { DownloadData } from "@/@types";
import { ITorrent } from "@/@types/torrent";
import FolderButton from "@/components/folderButton";
import DownloadCard from "@/features/downloads/components/cards/download";
import { DownloadCardLoading } from "@/features/downloads/components/cards/loading";
import UseDownloads from "@/features/downloads/hooks/useDownloads";
import { useMapState } from "@/hooks";
import { isTorrent } from "@/lib"; // Importing the type guard
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";

export const Route = createFileRoute("/downloads")({
  component: Downloads,
});

function Downloads() {
  const { downloading, getQueue, fetchDownloads } = UseDownloads();
  const {
    map: statsMap,
    set: setStats,
    remove: removeStats,
  } = useMapState<string, ITorrent | DownloadData>();

  // Retrieve the current download queue once per render
  const queue = useMemo(getQueue, [getQueue]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const handleProgress = useCallback(
    (_event: any, data: ITorrent | DownloadData) => {
      console.log("Download progress:", data);
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
    ipcRenderer.on("download:progress", handleProgress);
    ipcRenderer.on("download:complete", handleProgress);
    return () => {
      ipcRenderer.off("torrent:progress", handleProgress);
      ipcRenderer.off("download:progress", handleProgress);
      ipcRenderer.off("download:complete", handleProgress);
    };
  }, [handleProgress]);

  const renderDownloadCard = useCallback(
    (item: ITorrent | DownloadData) => {
      const stats =
        statsMap?.get(isTorrent(item) ? item.infoHash : item.id) ?? item;

      if (
        (stats && stats.status === "stopped") ||
        stats?.status === "error" ||
        !stats
      )
        return null;
      if (stats?.status === "pending") return <DownloadCardLoading />;
      if (isTorrent(item))
        return (
          <DownloadCard
            key={item.infoHash}
            stats={stats}
            deleteStats={removeStats}
          />
        );
      return (
        <DownloadCard key={item.id} stats={stats} deleteStats={removeStats} />
      );
    },
    [removeStats, statsMap]
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* ACTION BAR */}
      <div className="w-full flex justify-between flex-row bg-background/50 border-b mb-5 p-4 py-2.5">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">Downloads</h1>
        </div>

        <div>
          <FolderButton
            path="downloads"
            tooltip="Open downloads folder"
            variant={"secondary"}
          />
        </div>
      </div>

      {downloading?.size ? (
        Array.from(downloading.values()).map(renderDownloadCard)
      ) : (
        <div className="w-full flex justify-center items-center h-60 bg-muted/50">
          <h1 className="text-xl font-bold text-foreground">
            No downloads in progress
          </h1>
        </div>
      )}

      {!!queue.length && (
        <div className="p-3.5 mt-2 flex flex-col gap-4">
          {queue.map(renderDownloadCard)}
        </div>
      )}
    </div>
  );
}

export default Downloads;
