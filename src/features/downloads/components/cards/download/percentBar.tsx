import useDownloadTime from "@/features/downloads/hooks/useDownloadTime";
import { useMemo } from "react";

interface Props {
  percent: number;
  downlaodSpeed: number;
  totalSize: number;
}

function formatElapsedTime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(String(days).padStart(2, "0"));
  if (hours > 0 || days > 0) parts.push(String(hours).padStart(2, "0")); // Show hours if there are days
  if (minutes > 0 || hours > 0 || days > 0)
    parts.push(String(minutes).padStart(2, "0")); // Show minutes if there are hours
  parts.push(String(seconds).padStart(2, "0")); // Always show seconds

  return parts.join(":");
}

const PercentBar = ({ percent, downlaodSpeed, totalSize }: Props) => {
  const estimatedTime = useDownloadTime({
    downloadSpeedBytesPerSec: downlaodSpeed,
    totalSizeBytes: totalSize,
  });

  const barStyle = useMemo(() => {
    return { width: `${percent}%` };
  }, [percent]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-row justify-between w-full">
        <div className="text-sm text-muted-foreground font-semibold">
          <span>ETA:</span>
          <span className="ml-1">{estimatedTime}</span>
        </div>
        <p className="text-sm text-muted-foreground font-semibold">
          {percent.toFixed(2)}%
        </p>
      </div>
      <div className="inset-x-0 bottom-0 z-[3] w-full h-1 bg-primary/20 overflow-hidden relative rounded-full">
        <div
          className="absolute inset-x-0 bottom-0 z-[4] h-full bg-gradient-to-br from-blue-400 to-purple-400 transition-all duration-300 ease-in-out"
          style={barStyle}
        />
      </div>
    </div>
  );
};

export default PercentBar;
