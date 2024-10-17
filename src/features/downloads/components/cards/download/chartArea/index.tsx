import PercentBar from "../percentBar";
import DownloadCardChart from "./chart";

const DownloadCardChartArea = () => {
  return (
    <div className="size-full p-3.5 py-4 bg-card border rounded-xl overflow-hidden">
      <div className="size-full flex flex-col relative gap-5 justify-between">
        <div className="size-full overflow-hidden">
          <DownloadCardChart />
        </div>
        <div className="w-full">
          <PercentBar percent={50} />
        </div>
      </div>
    </div>
  );
};

export default DownloadCardChartArea;
