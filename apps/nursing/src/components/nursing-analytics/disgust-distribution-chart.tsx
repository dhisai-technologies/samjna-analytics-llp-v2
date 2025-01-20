"use client";

import type { NursingAnalytics } from "@config/nursing";
import { pastelColors } from "@config/ui";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/components/ui/chart";
import { LabelList, Pie, PieChart } from "recharts";

interface DisgustDistributionChartProps {
  data: NursingAnalytics["metadata"];
}

export function DisgustDistributionChart({ data }: DisgustDistributionChartProps) {
  if (!data) return null;

  const { chartConfig, chartData } = getDisgustPercentagesChartData(data);
  return (
    <Card className="relative flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Disgust vs Non-Disgust Frames</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row pb-0 justify-center h-full items-center">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[300px] h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="percentage" hideLabel />} />
            <Pie
              data={chartData}
              dataKey="percentage"
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.percentage}%
                  </text>
                );
              }}
              nameKey="category"
            >
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">Showing percentage of disgust vs non-disgust frames</div>
      </CardFooter>
    </Card>
  );
}

function getDisgustPercentagesChartData(data: NonNullable<NursingAnalytics["metadata"]>) {
  const chartConfig = {
    percentage: {
      label: "Percentage",
    },
    disgust: {
      label: "Disgust Frames",
      color: pastelColors.red,
    },
    non_disgust: {
      label: "Non-Disgust Frames",
      color: pastelColors.green,
    },
  } satisfies ChartConfig;

  const total = data.total_frames;
  const disgustFrames = data.disgust_frames;
  const nonDisgustFrames = data.non_disgust_frames;

  const getPercentage = (value: number) => Math.round((value / total) * 100);
  const getColor = (category: "disgust" | "non_disgust") => chartConfig[category]?.color;

  const chartData = [
    {
      category: "disgust",
      percentage: getPercentage(disgustFrames),
      fill: getColor("disgust"),
    },
    {
      category: "non_disgust",
      percentage: getPercentage(nonDisgustFrames),
      fill: getColor("non_disgust"),
    },
  ];

  return { chartData, chartConfig };
}
