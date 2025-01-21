"use client";

import type { StressAnalytics } from "@config/stress";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import ReactWordcloud, { type Word } from "react-wordcloud";

interface SpeechEmotionRecognitionProps {
  data: StressAnalytics["speech_emotion_recognition"];
}

export function SpeechEmotionRecognitionChart({ data }: SpeechEmotionRecognitionProps) {
  const words = getWords(data.word_weights);
  return (
    <Card className="relative flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Speech Emotion Analysis and Inference</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-start flex-1">
        <dl className="grid gap-3 py-2">
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Major Emotion: </dt>
            <dd>{data.major_emotion}</dd>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Average Pause Length: </dt>
            <dd>
              {data.pause_length.toFixed(2)} <span className="text-muted-foreground">(sec)</span>
            </dd>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Average Articulation Rate: </dt>
            <dd>
              {data.articulation_rate.toFixed(2)} <span className="text-muted-foreground">(syllables per sec)</span>
            </dd>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Average Speaking Rate: </dt>
            <dd>
              {data.speaking_rate.toFixed(2)} <span className="text-muted-foreground">(syllables per sec)</span>
            </dd>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Average Pitch: </dt>
            <dd>
              {data.pitch.toFixed(2)} <span className="text-muted-foreground">(Hz)</span>
            </dd>
          </div>
        </dl>
        <div className="flex items-center justify-center w-full">
          <ReactWordcloud
            words={words}
            options={{
              rotationAngles: [0, 0],
              rotations: 0,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function getWords(data: Record<string, number>): Word[] {
  return Object.entries(data).map(([text, value]) => ({
    text,
    value,
  }));
}
