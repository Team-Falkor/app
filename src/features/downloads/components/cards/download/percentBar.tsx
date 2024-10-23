import useDownloadTime from "@/features/downloads/hooks/useDownloadTime";
import { useMemo } from "react";

interface Props {
  percent: number;
  downlaodSpeed: number;
  totalSize: number;
  timeRemaning: number;
}

const PercentBar = ({
  percent,
  downlaodSpeed,
  totalSize,
  timeRemaning,
}: Props) => {
  const estimatedTime = useDownloadTime({
    timeRemaining: timeRemaning,
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
