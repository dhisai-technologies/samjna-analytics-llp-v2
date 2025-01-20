"use client";

import type { NursingAnalytics } from "@config/nursing";
import { pastelColors } from "@config/ui";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ValenceAndArousalLinePlotsProps {
  data: NursingAnalytics["metadata"];
}

export function ValenceAndArousalLinePlots({ data }: ValenceAndArousalLinePlotsProps) {
  if (!data) return null;
  const valenceData = data.valence_all.map((value, index) => ({ frame: index, valence: value }));
  const arousalData = data.arousal_all.map((value, index) => ({ frame: index, arousal: value }));
  return (
    <Card className="relative flex flex-col col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Valence and Arousal Per Frame</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col pb-0 justify-center h-full items-center gap-6">
        <div className="border rounded-md mt-6">
          <ChartContainer
            config={{
              valence: {
                label: "Valence",
                color: "hsl(var(--secondary))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={valenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey="frame"
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Frame Index", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Valence", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: string | number | (string | number)[]) => {
                        if (Array.isArray(value)) {
                          return value.map((v) => (typeof v === "number" ? v.toFixed(2) : v)).join(", ");
                        }
                        return typeof value === "number" ? value.toFixed(2) : value;
                      }}
                    />
                  }
                />
                <Line type="monotone" dataKey="valence" stroke={"hsl(var(--primary))"} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <CardFooter className="flex-col gap-2 text-sm mt-3">
            <div className="flex items-center gap-2 font-medium leading-none">Valence Per Frame</div>
          </CardFooter>
        </div>
        <div className="border rounded-md mb-6">
          <ChartContainer
            config={{
              arousal: {
                label: "Arousal",
                color: "hsl(var(--secondary))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={arousalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey="frame"
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Frame Index", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Arousal", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: string | number | (string | number)[]) => {
                        if (Array.isArray(value)) {
                          return value.map((v) => (typeof v === "number" ? v.toFixed(2) : v)).join(", ");
                        }
                        return typeof value === "number" ? value.toFixed(2) : value;
                      }}
                    />
                  }
                />
                <Line type="monotone" dataKey="arousal" stroke={pastelColors.red} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <CardFooter className="flex-col gap-2 text-sm mt-3">
            <div className="flex items-center gap-2 font-medium leading-none">Arousal Per Frame</div>
          </CardFooter>
        </div>
      </CardContent>
    </Card>
  );
}
