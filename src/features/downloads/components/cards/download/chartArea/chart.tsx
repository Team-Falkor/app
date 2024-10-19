import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart } from "recharts";

const chartData = [
  { speed: 0 },
  { speed: 10 },
  { speed: 20 },
  { speed: 20 },
  { speed: 30 },
  { speed: 40 },
  { speed: 50 },
  { speed: 60 },
  { speed: 70 },
  { speed: 80 },
  { speed: 50 },
  { speed: 30 },
];
const chartConfig = {
  desktop: {
    label: "speed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const DownloadCardChart = () => {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 2,
          bottom: 5,
          left: 2,
        }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={"#c084fc"} />
            <stop offset="100%" stopColor={"#60a5fa"} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />

        <Line
          dataKey="speed"
          type="step"
          stroke="url(#lineGradient)"
          strokeWidth={2}
          dot={false}
          fillOpacity={0.3}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default DownloadCardChart;
