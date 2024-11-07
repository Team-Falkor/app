import { DownloadData } from "@/@types";
import { ITorrent } from "@/@types/torrent";
import IGDBImage from "@/components/IGDBImage";
import { useDownloadSpeedHistory } from "@/features/downloads/hooks/useDownloadSpeedHistory";
import { bytesToHumanReadable, cn, isTorrent } from "@/lib";
import { useEffect, useMemo } from "react";
import DownloadCardActions from "./actions";
import DownloadCardChartArea from "./chartArea";
import DownloadCardStat from "./stat";
import DownloadCardTitle from "./title";

interface DownloadCardProps {
  stats: ITorrent | DownloadData;
  deleteStats: (id: string) => void;
}

const DownloadCard = ({ stats, deleteStats }: DownloadCardProps) => {
  const { speedHistory, updateSpeedHistory, peakSpeed } =
    useDownloadSpeedHistory();
  const { game_data } = stats;
  const torrentMode = isTorrent(stats);

  const downloading = useMemo(() => stats.status === "downloading", [stats]);
  const isPaused = useMemo(() => stats.status === "paused", [stats]);

  useEffect(() => {
    if (stats.downloadSpeed) {
      updateSpeedHistory(stats.downloadSpeed);
    }
  }, [stats, updateSpeedHistory, torrentMode]);

  const statsTexts = useMemo(() => {
    const downloadSpeed = downloading ? (stats.downloadSpeed ?? 0) : 0;
    const uploadSpeed =
      torrentMode && downloading ? (stats.uploadSpeed ?? 0) : 0;
    const peak = downloading ? (peakSpeed ?? 0) : 0;
    const totalSize = stats.totalSize ?? 0;

    return {
      downloadSpeedText: bytesToHumanReadable(downloadSpeed) + "/s",
      uploadSpeedText: bytesToHumanReadable(uploadSpeed) + "/s",
      peakSpeedText: bytesToHumanReadable(peak) + "/s",
      totalSizeText: bytesToHumanReadable(totalSize),
    };
  }, [downloading, stats, peakSpeed, torrentMode]);

  return (
    <div
      className={cn("w-full h-60 flex relative group", {
        "h-48": !downloading,
      })}
    >
      {/* Background */}
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
        {/* Game Name and Actions */}
        <div className="flex justify-start items-end h-full w-[65%]">
          <div className="flex flex-col justify-start items-start gap-1.5">
            <DownloadCardTitle title={game_data?.name ?? ""} />
            <div className="overflow-hidden p-1 relative">
              <DownloadCardActions
                stats={stats}
                deleteStats={deleteStats}
                isPaused={isPaused}
              />
            </div>
          </div>
        </div>

        {/* Downloading Stats */}
        <div className="flex flex-col gap-4 items-end justify-between h-full flex-1">
          {downloading && (
            <>
              <div className="size-full overflow-hidden">
                <DownloadCardChartArea
                  progress={
                    stats.progress
                      ? isTorrent(stats)
                        ? stats.progress * 100
                        : stats.progress
                      : 0
                  }
                  timeRemaining={stats.timeRemaining ?? 0}
                  chartData={speedHistory}
                />
              </div>

              <div className="flex gap-4 justify-between w-full">
                <DownloadCardStat
                  title="Download"
                  text={statsTexts.downloadSpeedText}
                />
                {torrentMode && (
                  <DownloadCardStat
                    title="Upload"
                    text={statsTexts.uploadSpeedText}
                  />
                )}
                <DownloadCardStat
                  title="Peak"
                  text={statsTexts.peakSpeedText}
                />
                <DownloadCardStat
                  title="Total"
                  text={statsTexts.totalSizeText}
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
