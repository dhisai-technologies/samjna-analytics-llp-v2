import type { InterviewAnalytics } from "@config/interview";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";

interface AudioAnalysisProps {
  data: InterviewAnalytics["audio"];
}

export function AudioAnalysis({ data }: AudioAnalysisProps) {
  if (!data) return null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle className="text-center text-lg">Audio Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center flex-1 w-full">
        <dl className="grid gap-3 py-2 w-full">
          <div className="flex flex-col gap-3 mt-5">
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Sentiment: </dt>
              <dd>
                {data.sentiment[0]?.label} (Score: {data.sentiment[0]?.score.toFixed(2)})
              </dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Sound Intensity: </dt>
              <dd>{data.sound_intensity.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Fundamental Frequency: </dt>
              <dd>{data.fundamental_frequency.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Spectral Energy: </dt>
              <dd>{data.spectral_energy.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Spectral Centroid: </dt>
              <dd>{data.spectral_centroid.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Zero Crossing Rate: </dt>
              <dd>{data.zero_crossing_rate.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Words per Minute: </dt>
              <dd>{data.avg_words_per_minute.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Average Unique Words per Minute: </dt>
              <dd>{data.avg_unique_words_per_minute.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Unique Word Count: </dt>
              <dd>{data.unique_word_count}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Filler Words per Minute: </dt>
              <dd>{data.filler_words_per_minute.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Noun Count: </dt>
              <dd>{data.noun_count}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Adjective Count: </dt>
              <dd>{data.adjective_count}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Verb Count: </dt>
              <dd>{data.verb_count}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Pause Rate: </dt>
              <dd>{data.pause_rate.toFixed(2)}</dd>
            </div>
            <div className="flex gap-3 items-start justify-between">
              <dt className="text-muted-foreground">Top 3 Characteristics: </dt>
              <dd className="text-xs text-right max-w-40">{data.top3}</dd>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
