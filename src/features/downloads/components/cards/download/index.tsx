import IGDBImage from "@/components/IGDBImage";
import UseDownloads from "@/features/downloads/hooks/useDownloads";
import { cn, igdb } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import DownloadCardActions from "./actions";
import DownloadCardChartArea from "./chartArea";
import DownloadCardStat from "./stat";
import DownloadCardTitle from "./title";

interface Props {
  downloading?: boolean;
  igdb_id: string;
  hash: string;
}

const DownloadCard = ({ downloading = false, igdb_id }: Props) => {
  const [progress, setProgress] = useState<number>(0);
  const { getTorrent } = UseDownloads();

  const torrent = useMemo(() => getTorrent(igdb_id), [igdb_id, getTorrent]);

  const { isPending, error, data } = useQuery({
    queryKey: ["igdb", "info", igdb_id],
    queryFn: async () => await igdb.info(igdb_id),
    enabled: !!igdb_id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (!downloading) return;

    window.ipcRenderer.on("torrent:progress", (_event, data) => {
      if (data.igdb_id !== igdb_id) return;
      setProgress(parseInt(data?.progress) ?? 0);
    });
  }, [igdb_id, downloading]);

  if (!torrent || isPending || error) return null;

  return (
    <div
      className={cn("w-full h-60 flex relative group", {
        "h-48 ": !downloading,
      })}
    >
      {/* BG */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <IGDBImage
          imageId={data?.cover?.image_id ?? ""}
          alt={data?.name ?? ""}
          className="object-cover w-full h-full relative z-[1]"
        />

        <div
          className={cn(
            "absolute inset-0 size-full bg-background opacity-55 z-[2]",
            {
              "opacity-90 overflow-hidden": !downloading,
            }
          )}
        />
      </div>

      {/* Content */}
      <div className="flex flex-row items-start justify-between size-full relative z-10 p-5 px-10">
        {/* NAME OF DOWNLOADG GAME */}
        {/* {!!downloading && <DownloadCardTitle title={title} />} */}
        <div className="flex justify-start items-end h-full w-[65%]">
          <div className="flex flex-col justify-start items-start gap-1.5">
            <div></div>

            <DownloadCardTitle title={data?.name ?? ""} />
            <div className="overflow-hidden p-1 relative">
              {/* Start hidden */}
              <DownloadCardActions
                downloading={downloading}
                startDownload={() => {}}
                stopDownload={() => {}}
                pauseDownload={() => {}}
              />
            </div>
          </div>
        </div>

        {/* DOWNLOADING STATS */}
        <div className="flex flex-col gap-4 items-end justify-between h-full flex-1">
          {!!downloading && (
            <>
              <div className="size-full overflow-hidden">
                <DownloadCardChartArea progress={progress} />
              </div>

              <div className="flex gap-4 justify-between w-full">
                <DownloadCardStat
                  title="Current"
                  text="10 mb/s"
                  key="current"
                />

                <DownloadCardStat title="Peak" text="25 mb/s" key="peak" />

                <DownloadCardStat title="Total" text="25 GB" key="total" />

                <DownloadCardStat title="Disk usage" text="5 mb/s" key="disk" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
