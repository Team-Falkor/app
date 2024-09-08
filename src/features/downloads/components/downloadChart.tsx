"use client";

import { Area, Bar, BarChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A simple area chart";

interface ChartData {
  download_speed: number;
}

const chartConfig = {
  download_speed: {
    label: "Download Speed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface Props {
  chartData: ChartData[];
}

const DownloadChart = ({ chartData }: Props) => {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 2,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        throttleDelay={300}
      >
        <Area
          dataKey="download_speed"
          type="natural"
          fill="hsl(var(--chart-1))"
          stroke="hsl(var(--chart-1))"
          isAnimationActive={false}
        />
        <Bar
          isAnimationActive={false}
          dataKey="download_speed"
          fill="hsl(var(--chart-1))"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default DownloadChart;
