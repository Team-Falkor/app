import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart } from "recharts";

type ChartData = {
  speed: number;
};

interface Props {
  chartData: ChartData[];
}

const chartConfig = {
  desktop: {
    label: "speed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const DownloadCardChart = ({ chartData }: Props) => {
  const gradientDefs = useMemo(
    () => (
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={"#c084fc"} />
          <stop offset="100%" stopColor={"#60a5fa"} />
        </linearGradient>
      </defs>
    ),
    []
  );

  // Ensure the chart only renders if there's data
  if (!chartData || chartData.length === 0) {
    return <div>No data available for chart.</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 2,
          bottom: 5,
          left: 2,
        }}
      >
        {gradientDefs}
        <CartesianGrid vertical={false} />
        <Line
          dataKey="speed"
          type="monotone"
          stroke="url(#lineGradient)"
          strokeWidth={4}
          dot={false}
          fillOpacity={0.3}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default DownloadCardChart;
