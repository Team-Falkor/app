import DownloadCard from "@/features/downloads/components/cards/download";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/downloads")({
  component: Downloads,
});

function Downloads() {
  return (
    <div className="w-full h-full flex flex-col">
      <DownloadCard
        image="https://images.igdb.com/igdb/image/upload/t_720p/ar1ys1.webp"
        poster="https://images.igdb.com/igdb/image/upload/t_cover_big/co5l7s.webp"
        title="Silent Hill 2"
        downloading={true}
      />

      <DownloadCard
        image="https://images.igdb.com/igdb/image/upload/t_720p/ar2o80.webp"
        poster="https://images.igdb.com/igdb/image/upload/t_cover_big/co8bhn.webp"
        title="Dragon Ball: Sparking Zero"
      />
    </div>
  );
}
