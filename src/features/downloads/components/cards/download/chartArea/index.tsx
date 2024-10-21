import { useMemo } from "react";
import PercentBar from "../percentBar";

type ChartData = {
  speed: number;
};

interface Props {
  progress: number;
  chartData: ChartData[];
}

const DownloadCardChartArea = ({ progress }: Props) => {
  const memoizedProgress = useMemo(() => progress ?? 0, [progress]);
  // const memoizedChartData = useMemo(() => chartData, [chartData]);

  return (
    <div className="size-full p-3.5 py-4 bg-card border rounded-xl overflow-hidden">
      <div className="size-full flex flex-col relative gap-5 justify-between">
        <div className="size-full overflow-hidden">
          {/* <DownloadCardChart chartData={memoizedChartData} /> */}
        </div>
        <div className="w-full">
          <PercentBar percent={memoizedProgress} />
        </div>
      </div>
    </div>
  );
};

export default DownloadCardChartArea;
