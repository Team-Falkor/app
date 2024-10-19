import PercentBar from "../percentBar";
import DownloadCardChart from "./chart";

type ChartData = {
  speed: number;
};

interface Props {
  progress: number;
  chartData: ChartData[];
}

const DownloadCardChartArea = ({ progress, chartData }: Props) => {
  return (
    <div className="size-full p-3.5 py-4 bg-card border rounded-xl overflow-hidden">
      <div className="size-full flex flex-col relative gap-5 justify-between">
        <div className="size-full overflow-hidden">
          <DownloadCardChart chartData={chartData} />
        </div>
        <div className="w-full">
          <PercentBar percent={progress ?? 0} />
        </div>
      </div>
    </div>
  );
};

export default DownloadCardChartArea;
