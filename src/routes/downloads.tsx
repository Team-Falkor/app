import DownloadChart from "@/features/downloads/components/downloadChart";
import DownloadTextItem from "@/features/downloads/components/downloadTextItem";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/downloads")({
  component: Downloads,
});

const chartDataArray = Array.from({ length: 50 }, (_, i) => ({
  download_speed: Math.floor(Math.random() * 100) + i,
}));

function Downloads() {
  const [chartData, setChartData] = useState(chartDataArray);

  const updateChart = (): void => {
    setChartData((prevChartData) => {
      const newChartData = [...prevChartData];
      newChartData.shift();
      newChartData.push({
        download_speed: Math.floor(Math.random() * 100) + 1,
      });
      return newChartData;
    });
  };

  useEffect(() => {
    const interval = setInterval(updateChart, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col relative">
      <div className="w-full h-60 overflow-hidden relative">
        <div className="absolute inset-0 z-10 p-10 w-full flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Star Wars Outlaws</h1>
          </div>
          <div className="flex flex-row w-2/6 justify-between">
            <DownloadTextItem
              text1={`${chartData[0].download_speed} mbps`}
              text2="Current"
            />

            <DownloadTextItem text1="25 mbps" text2="Peak" />

            <DownloadTextItem text1="12 gb" text2="Total" />

            <DownloadTextItem text1="120 mbps" text2="Disk Usage" />
          </div>
        </div>

        <div className="absolute inset-0 z-0 opacity-50">
          <img
            src="https://images.igdb.com/igdb/image/upload/t_720p/ar2cn6.webp"
            alt="bg"
            className="w-full h-full object-cover z-0 absolute inset-0 object-top"
          />
          <DownloadChart chartData={chartData} />
        </div>
      </div>
    </div>
  );
}
