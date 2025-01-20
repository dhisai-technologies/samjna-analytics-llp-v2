"use client";
import type { NursingAnalytics } from "@config/nursing";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";

interface NursingStatisticsProps {
  data: NursingAnalytics["metadata"];
}

export function NursingStatistics({ data }: NursingStatisticsProps) {
  if (!data) return null;
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle className="text-center text-lg">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center flex-1 w-full">
        <dl className="grid gap-3 py-2 w-full">
          <div className="flex flex-col gap-3 mt-5">
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Valence: </dt>
              <dd>{data.valence_mean?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Standard Deviation of Valence: </dt>
              <dd>{data.valence_std?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Arousal: </dt>
              <dd>{data.arousal_mean?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Standard Deviation of Arousal: </dt>
              <dd>{data.arousal_std?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Valence (Disgust): </dt>
              <dd>{data.valence_mean_disgust?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Standard Deviation of Valence (Disgust): </dt>
              <dd>{data.valence_std_disgust?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Arousal (Disgust): </dt>
              <dd>{data.arousal_mean_disgust?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Standard Deviation of Arousal (Disgust): </dt>
              <dd>{data.arousal_std_disgust?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Valence (Non-Disgust): </dt>
              <dd>{data.valence_mean_non_disgust?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Standard Deviation of Valence (Non-Disgust): </dt>
              <dd>{data.valence_std_non_disgust?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Arousal (Non-Disgust): </dt>
              <dd>{data.arousal_mean_non_disgust?.toFixed(2) || 0}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Standard Deviation of Arousal (Non-Disgust): </dt>
              <dd>{data.arousal_std_non_disgust?.toFixed(2) || 0}</dd>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
