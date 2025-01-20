"use client";

import type { NursingAnalytics } from "@config/nursing";
import { pastelColors } from "@config/ui";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/components/ui/chart";
import { convertSnakeToReadable } from "@utils/helpers";
import { Bar, BarChart, LabelList, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ActionUnitDistributionChartsProps {
  data: NursingAnalytics["metadata"];
}

export function ActionUnitDistributionCharts({ data }: ActionUnitDistributionChartsProps) {
  if (!data) return null;
  return (
    <Card className="relative flex flex-col col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Action Unit Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap pb-0 justify-center h-full items-center gap-6">
        <ActionUnitCountsBarChart counts={data.action_unit_counts} />
        <ActionUnitPercentagesPieChart percentages={data.action_unit_percentages} />
      </CardContent>
    </Card>
  );
}

function ActionUnitCountsBarChart({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const chartData = Object.entries(counts).map(([key, value]) => ({
    actionUnit: convertSnakeToReadable(key),
    count: value,
  }));
  return (
    <div className="border rounded-md mt-6">
      <ChartContainer
        config={{
          count: {
            label: "Action Unit Counts",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis
              dataKey="actionUnit"
              stroke="hsl(var(--foreground))"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              angle={-15}
              textAnchor="end"
            />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value: string | number | (string | number)[]) => {
                    if (Array.isArray(value)) {
                      return value.join(", ");
                    }
                    return typeof value === "number" ? value.toString() : value;
                  }}
                />
              }
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">Action Unit and Their Occurrence Count</div>
        <div className="leading-none text-muted-foreground">
          Number of occurrences of each facial action unit like AU1, AU2, etc.
        </div>
      </CardFooter>
    </div>
  );
}

function ActionUnitPercentagesPieChart({ percentages }: { percentages: Record<string, number> }) {
  const { chartConfig, chartData } = getActionUnitPercentagesChartData(percentages);
  return (
    <div className="border rounded-md mb-6">
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
              fontSize={8}
              formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">Action Unit Percentages</div>
        <div className="leading-none text-muted-foreground">Percentage of frames for each action unit</div>
      </CardFooter>
    </div>
  );
}

function getActionUnitPercentagesChartData(percentages: Record<string, number>) {
  const chartConfig: ChartConfig = Object.keys(percentages).reduce((acc, key, index) => {
    const pastelColorKeys = Object.keys(pastelColors);
    const colorKey = pastelColorKeys[index % pastelColorKeys.length] as keyof typeof pastelColors;
    return Object.assign(acc, {
      [key]: {
        label: convertSnakeToReadable(key),
        color: pastelColors[colorKey] || "#000000",
      },
    });
  }, {});

  const chartData = Object.keys(percentages).map((emotion, index) => {
    const percentage = percentages[emotion] || 0;
    const pastelColorKeys = Object.keys(pastelColors);
    const colorKey = pastelColorKeys[index % pastelColorKeys.length] as keyof typeof pastelColors;
    return {
      category: emotion,
      percentage: Number(percentage.toFixed(1)),
      fill: pastelColors[colorKey] || "#000000",
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
