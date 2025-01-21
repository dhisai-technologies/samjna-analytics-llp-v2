import type { StressAnalytics } from "@config/stress";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";

interface EyeEmotionRecognitionProps {
  data: StressAnalytics["eye_emotion_recognition"];
}

export function EyeEmotionRecognitionChart({ data }: EyeEmotionRecognitionProps) {
  return (
    <Card className="relative flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Eye Emotion Analysis and Inference</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-start pb-0 w-full">
        <dl className="grid gap-3 py-2 w-full">
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Total Blinks: </dt>
            <dd>{data.total_blinks}</dd>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Average Blink Duration: </dt>
            <dd>
              {data.avg_blink_duration.toFixed(2)} <span className="text-muted-foreground">(sec)</span>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
