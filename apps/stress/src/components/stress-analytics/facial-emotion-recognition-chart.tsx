"use client";

import type { StressAnalytics } from "@config/stress";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/components/ui/chart";
import Image from "next/image";
import { LabelList, Pie, PieChart } from "recharts";

interface FacialEmotionRecognitionProps {
  data: StressAnalytics["facial_emotion_recognition"];
}

export function FacialEmotionRecognitionChart({ data }: FacialEmotionRecognitionProps) {
  const { chartConfig, chartData } = getChartData(data);
  return (
    <Card className="relative flex flex-col col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Facial Emotion Analysis and Inference</CardTitle>
      </CardHeader>
      <div className="flex-1 flex flex-col items-center justify-center py-5 xl:flex-row">
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
                      {payload.percentage}
                    </text>
                  );
                }}
                nameKey="emotion"
              >
                <LabelList
                  dataKey="emotion"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        {data.plot && (
          <div className="flex justify-center p-5">
            <Image
              src={data.plot}
              alt="Facial Emotion Recognition"
              width={600}
              height={400}
              className="h-[400px] w-[600px] !min-w-[300px] object-contain"
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function getChartData(data: StressAnalytics["facial_emotion_recognition"]) {
  const labels = Object.keys(data.class_wise_frame_count);
  const chartConfig = {
    percentage: {
      label: "Percentage",
    },
    sad: {
      label: "Sad",
      color: "#1E90FF",
    },
    fear: {
      label: "Fear",
      color: "#2E2B5F",
    },
    angry: {
      label: "Angry",
      color: "#8B0000",
    },
    happy: {
      label: "Happy",
      color: "#B8860B",
    },
    disgust: {
      label: "Disgust",
      color: "#3A5F0B",
    },
    neutral: {
      label: "Neutral",
      color: "#505050",
    },
    surprised: {
      label: "Surprised",
      color: "#FF8C00",
    },
  } satisfies ChartConfig;
  const total = Object.values(data.class_wise_frame_count).reduce((acc, curr) => acc + curr, 0);
  const getPercentage = (value: number) => Math.round((value / total) * 100);
  const getColor = (value: keyof StressAnalytics["facial_emotion_recognition"]["class_wise_frame_count"]) =>
    chartConfig[value]?.color;
  const chartData = [
    { emotion: "sad", percentage: getPercentage(data.class_wise_frame_count.sad), fill: getColor("sad") },
    { emotion: "fear", percentage: getPercentage(data.class_wise_frame_count.fear), fill: getColor("fear") },
    { emotion: "angry", percentage: getPercentage(data.class_wise_frame_count.angry), fill: getColor("angry") },
    { emotion: "happy", percentage: getPercentage(data.class_wise_frame_count.happy), fill: getColor("happy") },
    { emotion: "disgust", percentage: getPercentage(data.class_wise_frame_count.disgust), fill: getColor("disgust") },
    { emotion: "neutral", percentage: getPercentage(data.class_wise_frame_count.neutral), fill: getColor("neutral") },
    {
      emotion: "surprised",
      percentage: getPercentage(data.class_wise_frame_count.surprised),
      fill: getColor("surprised"),
    },
  ];
  return { chartData: chartData.filter(({ percentage }) => percentage > 0), chartConfig, labels };
}
