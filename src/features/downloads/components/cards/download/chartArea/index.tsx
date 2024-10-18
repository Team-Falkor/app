import PercentBar from "../percentBar";
import DownloadCardChart from "./chart";

interface Props {
  progress: number;
}

const DownloadCardChartArea = ({ progress }: Props) => {
  return (
    <div className="size-full p-3.5 py-4 bg-card border rounded-xl overflow-hidden">
      <div className="size-full flex flex-col relative gap-5 justify-between">
        <div className="size-full overflow-hidden">
          <DownloadCardChart />
        </div>
        <div className="w-full">
          <PercentBar percent={progress ?? 0} />
        </div>
      </div>
    </div>
  );
};

export default DownloadCardChartArea;
