import IGDBImage from "@/components/IGDBImage";
import { useDownloadSpeedHistory } from "@/features/downloads/hooks/useDownloadSpeedHistory";
import { bytesToHumanReadable, cn, igdb } from "@/lib";
import { Torrent } from "@/stores/downloads";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [stats, setStats] = useState<Torrent | null>(null);
  const [ready, setReady] = useState(false);
  const { speedHistory, updateSpeedHistory, peakSpeed } =
    useDownloadSpeedHistory();
  const queryclient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["igdb", "info", igdb_id],
    queryFn: async () => await igdb.info(igdb_id),
    enabled: !!ready && !!igdb_id,
  });

  useEffect(() => {
    window.ipcRenderer.on("torrent:progress", (_event, data) => {
      if (data.igdb_id !== igdb_id) return;
      setReady(true);
      setStats(data);
      updateSpeedHistory(data.downloadSpeed); // Update the speed history using the hook
    });

    window.ipcRenderer.once("torrent:ready", (_event, data) => {
      if (data.igdb_id !== igdb_id) return;
      setReady(true);
    });

    return () => {
      window.ipcRenderer.off("torrent:progress", (_event, data) => {
        if (data.igdb_id !== igdb_id) return;
        setStats(data);
        updateSpeedHistory(data.downloadSpeed); // Update the speed history using the hook
      });

      window.ipcRenderer.off("torrent:ready", (_event, data) => {
        if (data.igdb_id !== igdb_id) return;
        setReady(true);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [igdb_id, data]);

  useEffect(() => {
    console.log({
      isPending,
      data,
    });
  }, [data, isPending]);

  if (error) return null;
  if (isPending)
    return (
      <div className="w-full h-60 flex justify-center items-center bg-primary/5">
        <h1 className="text-xl font-bold text-foreground">
          Torrent is loading, please wait...
        </h1>
      </div>
    );

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
                  progress={stats?.progress ?? 0}
                  chartData={speedHistory}
                />
              </div>

              <div className="flex gap-4 justify-between w-full">
                <DownloadCardStat
                  title="Download"
                  text={
                    bytesToHumanReadable(
                      stats?.downloadSpeed ? stats.downloadSpeed : 0
                    ) + "/s"
                  }
                  key="Download"
                />

                <DownloadCardStat
                  title="Upload"
                  text={bytesToHumanReadable(stats?.uploadSpeed ?? 0) + "/s"}
                  key="Upload"
                />

                <DownloadCardStat
                  title="Peak"
                  text={bytesToHumanReadable(peakSpeed ?? 0) + "/s"}
                  key="peak"
                />

                <DownloadCardStat
                  title="Total"
                  text={bytesToHumanReadable(stats?.totalSize ?? 0)}
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
