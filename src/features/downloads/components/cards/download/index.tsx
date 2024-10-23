// ... other imports
import IGDBImage from "@/components/IGDBImage";
import { useDownloadSpeedHistory } from "@/features/downloads/hooks/useDownloadSpeedHistory";
import { bytesToHumanReadable, cn, igdb } from "@/lib";
import { Torrent } from "@/stores/downloads";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import DownloadCardActions from "./actions";
import DownloadCardChartArea from "./chartArea";
import DownloadCardStat from "./stat";
import DownloadCardTitle from "./title";

interface Props {
  downloading?: boolean;
  igdb_id: string;
  hash: string;
  stats: Torrent | null;
}

const DownloadCard = ({ downloading = false, igdb_id, stats }: Props) => {
  const { speedHistory, updateSpeedHistory, peakSpeed } =
    useDownloadSpeedHistory();

  const { isPending, error, data } = useQuery({
    queryKey: ["igdb", "info", igdb_id],
    queryFn: async () => {
      console.log("testing");
      return await igdb.info(igdb_id);
    },
  });

  useEffect(() => {
    if (!stats?.downloadSpeed) return;
    updateSpeedHistory(stats.downloadSpeed);
  }, [stats?.downloadSpeed, updateSpeedHistory]);

  const downloadSpeedText = useMemo(
    () =>
      bytesToHumanReadable(!stats?.paused ? stats?.downloadSpeed || 0 : 0) +
      "/s",
    [stats?.downloadSpeed, stats?.paused]
  );

  const uploadSpeedText = useMemo(
    () =>
      bytesToHumanReadable(!stats?.paused ? stats?.uploadSpeed || 0 : 0) + "/s",
    [stats?.paused, stats?.uploadSpeed]
  );

  const peakSpeedText = useMemo(
    () => bytesToHumanReadable(!stats?.paused ? peakSpeed || 0 : 0) + "/s",
    [peakSpeed, stats?.paused]
  );

  const totalSizeText = useMemo(
    () => bytesToHumanReadable(stats?.totalSize || 0),
    [stats?.totalSize]
  );

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
        {/* NAME OF DOWNLOAD GAME */}
        <div className="flex justify-start items-end h-full w-[65%]">
          <div className="flex flex-col justify-start items-start gap-1.5">
            <DownloadCardTitle title={data?.name ?? ""} />
            <div className="overflow-hidden p-1 relative">
              {/* Start hidden */}
              <DownloadCardActions stats={stats} />
            </div>
          </div>
        </div>

        {/* DOWNLOADING STATS */}
        <div className="flex flex-col gap-4 items-end justify-between h-full flex-1">
          {!!downloading && (
            <>
              <div className="size-full overflow-hidden">
                <DownloadCardChartArea
                  progress={stats?.progress ? stats.progress * 100 : 0}
                  timeRemaining={stats?.timeRemaining ?? 0}
                  chartData={speedHistory}
                  downloadSpeed={stats?.downloadSpeed ?? 0}
                  totalSize={stats?.totalSize ?? 0}
                />
              </div>

              <div className="flex gap-4 justify-between w-full">
                <DownloadCardStat
                  title="Download"
                  text={downloadSpeedText}
                  key="Download"
                />
                <DownloadCardStat
                  title="Upload"
                  text={uploadSpeedText}
                  key="Upload"
                />
                <DownloadCardStat
                  title="Peak"
                  text={peakSpeedText}
                  key="Peak"
                />
                <DownloadCardStat
                  title="Total"
                  text={totalSizeText}
                  key="Total"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
