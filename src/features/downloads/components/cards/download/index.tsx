import IGDBImage from "@/components/IGDBImage";
import { useDownloadSpeedHistory } from "@/features/downloads/hooks/useDownloadSpeedHistory";
import { bytesToHumanReadable, cn, igdb } from "@/lib";
import { Torrent } from "@/stores/downloads";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  const [stats, setStats] = useState<Torrent | null>(null);
  const { speedHistory, updateSpeedHistory, peakSpeed } =
    useDownloadSpeedHistory();

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
    window.ipcRenderer.on("torrent:progress", (_event, data) => {
      if (data.igdb_id !== igdb_id) return;
      setProgress(parseInt(data?.progress) ?? 0);
      setStats(data);
      updateSpeedHistory(data.downloadSpeed); // Update the speed history using the hook
    });
  }, [igdb_id, downloading, updateSpeedHistory]);

  if (!stats || isPending || error) return null;

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
                <DownloadCardChartArea
                  progress={stats.progress}
                  chartData={speedHistory}
                />
              </div>

              <div className="flex gap-4 justify-between w-full">
                <DownloadCardStat
                  title="Current"
                  text={
                    bytesToHumanReadable(
                      stats?.downloadSpeed ? stats.downloadSpeed : 0
                    ) + "/s"
                  }
                  key="current"
                />

                <DownloadCardStat
                  title="Peak"
                  text={bytesToHumanReadable(peakSpeed ?? 0) + "/s"}
                  key="peak"
                />

                <DownloadCardStat
                  title="Total"
                  text={bytesToHumanReadable(stats.totalSize)}
                  key="total"
                />
                {/* 
                <DownloadCardStat title="Disk usage" text="5 mb/s" key="disk" /> */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
