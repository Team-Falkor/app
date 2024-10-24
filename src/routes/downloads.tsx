import { ITorrent } from "@/@types/torrent";
import DownloadCard from "@/features/downloads/components/cards/download";
import { DownloadCardLoading } from "@/features/downloads/components/cards/loading";
import UseDownloads from "@/features/downloads/hooks/useDownloads";
import { useMapState } from "@/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";

export const Route = createFileRoute("/downloads")({
  component: Downloads,
});

function Downloads() {
  const { downloading, getQueue, fetchDownloads } = UseDownloads();
  const { map: statsMap, set: setStats } = useMapState<string, ITorrent>();

  // Memoize queue based on `downloading`, as it’s the relevant state
  const queue = useMemo(() => getQueue() || [], [getQueue]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const handleProgress = useCallback(
    (_event: any, data: ITorrent) => {
      setStats(data.infoHash, data);
    },
    [setStats]
  );

  useEffect(() => {
    window.ipcRenderer.on("torrent:progress", handleProgress);

    return () => {
      window.ipcRenderer.off("torrent:progress", handleProgress);
    };
  }, [handleProgress]);

  return (
    <div className="w-full h-full flex flex-col">
      {downloading?.length ? (
        downloading.map((torrent) => {
          const hash = torrent.infoHash;
          const stats = statsMap.get(hash);

          if (!stats) return <DownloadCardLoading />;
          return <DownloadCard key={hash} {...stats} />;
        })
      ) : (
        <div className="w-full flex justify-center items-center h-60 bg-primary/5">
          <h1 className="text-xl font-bold text-foreground">
            No downloads in progress
          </h1>
        </div>
      )}

      {!!queue.length && (
        <div className="p-3.5 mt-2 flex flex-col gap-4">
          {queue.map((torrent) => {
            const hash = torrent.infoHash;
            const stats = statsMap.get(hash);

            if (!stats) return <DownloadCardLoading />;
            return <DownloadCard key={hash} {...stats} />;
          })}
        </div>
      )}
    </div>
  );
}
