"use client";

import type { NursingAnalytics } from "@config/nursing";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Boxplot } from "../box-plot";

interface ValenceAndArousalBoxPlotsProps {
  data: NursingAnalytics["metadata"];
}

export function ValenceAndArousalBoxPlots({ data }: ValenceAndArousalBoxPlotsProps) {
  if (!data) return null;

  return (
    <Card className="relative flex flex-col col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Valence and Arousal Per Frame: Disgust vs Non-Disgust</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col pb-0 justify-center h-full items-center gap-6">
        <div className="border rounded-md mt-6 p-3">
          <div className="flex items-center justify-center w-full">
            <Boxplot
              width={600}
              height={400}
              data={getBoxPlotData({
                Disgust: data.valence_disgust,
                "Non Disgust": data.valence_non_disgust,
              })}
            />
          </div>
          <CardFooter className="flex-col gap-2 text-sm mt-3">
            <div className="flex items-center gap-2 font-medium leading-none">Valence Per Frame</div>
            <div className="leading-none text-muted-foreground">
              Box plot showing valence distribution for disgust and non-disgust frames
            </div>
          </CardFooter>
        </div>
        <div className="border rounded-md mb-6 p-3">
          <div className="flex items-center justify-center w-full">
            <Boxplot
              width={600}
              height={400}
              data={getBoxPlotData({
                Disgust: data.arousal_disgust,
                "Non Disgust": data.arousal_non_disgust,
              })}
            />
          </div>
          <CardFooter className="flex-col gap-2 text-sm mt-3">
            <div className="flex items-center gap-2 font-medium leading-none">Arousal Per Frame</div>
            <div className="leading-none text-muted-foreground">
              Box plot showing arousal distribution for disgust and non-disgust frames
            </div>
          </CardFooter>
        </div>
      </CardContent>
    </Card>
  );
}

function getBoxPlotData(data: Record<string, number[]>) {
  const result: { name: string; value: number }[] = [];
  for (const key in data) {
    if (data[key]) {
      for (const value of data[key]) {
        result.push({ name: key, value });
      }
    }
  }
  return result;
}
