"use client";

import type { InterviewAnalytics } from "@config/interview";
import { pastelColors } from "@config/ui";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/components/ui/chart";
import { convertSnakeToReadable } from "@utils/helpers";
import { LabelList, Pie, PieChart } from "recharts";

interface FacialEmotionRecognitionChartProps {
  data: InterviewAnalytics["facial_emotion_recognition"];
}

export function FacialEmotionRecognitionChart({ data }: FacialEmotionRecognitionChartProps) {
  if (!data) return null;

  const { chartConfig, chartData } = getEmotionPercentagesChartData(data.class_wise_frame_count);

  return (
    <Card className="relative flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Facial Emotion Recognition</CardTitle>
      </CardHeader>
      <CardContent className="pb-0 flex flex-col justify-center h-full items-center gap-6">
        <ChartContainer config={chartConfig} className="h-[400px]">
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
                    {payload.count}
                  </text>
                );
              }}
              nameKey="category"
            >
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={8}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">Frame count for each emotion</div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

function getEmotionPercentagesChartData(counts: Record<string, number>) {
  const chartConfig: ChartConfig = Object.keys(counts).reduce((acc, key, index) => {
    const pastelColorKeys = Object.keys(pastelColors);
    const colorKey = pastelColorKeys[index % pastelColorKeys.length] as keyof typeof pastelColors;
    return Object.assign(acc, {
      [key]: {
        label: convertSnakeToReadable(key),
        color: pastelColors[colorKey] || "#000000",
      },
    });
  }, {});
  const sum = Object.values(counts).reduce((a, b) => a + b, 0);
  const chartData = Object.keys(counts).map((emotion, index) => {
    const count = counts[emotion] || 0;
    const pastelColorKeys = Object.keys(pastelColors);
    const colorKey = pastelColorKeys[index % pastelColorKeys.length] as keyof typeof pastelColors;
    return {
      category: emotion,
      percentage: Number(((count / sum) * 100).toFixed(1)),
      fill: pastelColors[colorKey] || "#000000",
      count,
    };
  });

  return {
    chartConfig: {
      percentage: {
        label: "Percentage",
      },
      ...chartConfig,
    },
    chartData,
  };
}
