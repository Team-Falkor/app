// ... other imports
import { ITorrent } from "@/@types/torrent";
import IGDBImage from "@/components/IGDBImage";
import { useDownloadSpeedHistory } from "@/features/downloads/hooks/useDownloadSpeedHistory";
import { bytesToHumanReadable, cn } from "@/lib";
import { useEffect, useMemo } from "react";
import DownloadCardActions from "./actions";
import DownloadCardChartArea from "./chartArea";
import DownloadCardStat from "./stat";
import DownloadCardTitle from "./title";

const DownloadCard = (stats: ITorrent) => {
  const { speedHistory, updateSpeedHistory, peakSpeed } =
    useDownloadSpeedHistory();

  const { game_data } = stats;

  const downloading = useMemo(() => !stats.paused, [stats?.paused]);

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

  return (
    <div
      className={cn("w-full h-60 flex relative group", {
        "h-48 ": !downloading,
      })}
    >
      {/* BG */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <IGDBImage
          imageId={game_data?.image_id ?? ""}
          alt={game_data?.name ?? ""}
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
            <DownloadCardTitle title={game_data?.name ?? ""} />
            <div className="overflow-hidden p-1 relative">
              {/* Start hidden */}
              <DownloadCardActions {...stats} />
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
