import DownloadCard from "@/features/downloads/components/cards/download";
import { useDownloadStore } from "@/stores/downloads";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/downloads")({
  component: Downloads,
});

function Downloads() {
  const { downloading, queue } = useDownloadStore();

  return (
    <div className="w-full h-full flex flex-col">
      {downloading?.length ? (
        downloading.map((torrent, i) => (
          <DownloadCard
            key={i}
            downloading={!!torrent?.paused}
            igdb_id={torrent.igdb_id}
            hash={torrent.infoHash}
          />
        ))
      ) : (
        <div className="w-full flex justify-center items-center h-60 bg-primary/5">
          <h1 className="text-xl font-bold text-foreground">
            No downloads in progress
          </h1>
        </div>
      )}

      {!!queue.length && (
        <div className="p-3.5 mt-2 flex flex-col gap-4">
          {queue.map((torrent, i) => (
            <DownloadCard
              key={i}
              downloading={!!torrent?.paused}
              igdb_id={torrent.igdb_id}
              hash={torrent.infoHash}
            />
          ))}
        </div>
      )}
    </div>
  );
}
