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
  const { map: statsMap, set: setStats } = useMapState<
    string,
    ITorrent | DownloadData
  >();

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
    return () => {
      ipcRenderer.off("torrent:progress", handleProgress);
      ipcRenderer.off("download:progress", handleProgress);
    };
  }, [handleProgress]);

  const renderDownloadCard = (item: ITorrent | DownloadData) => {
    const stats = statsMap.get(isTorrent(item) ? item.infoHash : item.id);

    console.log("Stats:", stats);

    if (!stats) return <DownloadCardLoading />;
    if (isTorrent(item)) return <DownloadCard key={item.infoHash} {...stats} />;
    return <DownloadCard key={item.id} {...stats} />;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* ACTION BAR */}
      <div className="w-full flex justify-end flex-row bg-background/50 border-b mb-5 p-2">
        <FolderButton
          path="downloads"
          tooltip="Open downloads folder"
          variant={"secondary"}
        />
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
