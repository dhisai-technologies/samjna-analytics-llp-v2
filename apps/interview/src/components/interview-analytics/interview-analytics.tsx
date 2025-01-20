"use client";

import { useDownloadFile } from "@/lib/hooks/use-download-file";
import { getInterviewQuestionTypeIcon } from "@/lib/utils/interview-question";
import type { InterviewQuestion, InterviewSession } from "@config/interview";
import { CountAnimation } from "@ui/components/count-animation";
import { Loaders } from "@ui/components/loaders";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/ui/alert";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { AlertCircle, Combine, Download } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { AudioAnalysis } from "./audio-analysis";
import { FacialEmotionRecognitionChart } from "./facial-emotion-recognition-chart";

interface IndividualAnalyticsProps {
  session: InterviewSession;
  question: InterviewQuestion;
  live?: boolean;
}

export function IndividualAnalytics({ session, question, live = false }: IndividualAnalyticsProps) {
  const analytics = session.individualAnalytics?.find((value) => value.id === question.id);
  if (!analytics) {
    return <AnalyticsFallback error={session.error} live={live} />;
  }
  const Icon = getInterviewQuestionTypeIcon(question.type);
  const error = console.error;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <div>
      <div className="p-2 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="self-start flex size-8 items-center justify-center rounded-sm border">
            <Icon className="size-3 shrink-0" />
          </div>
          <div>
            <h2 className="font-semibold">{question.title}</h2>
            <p className="text-xs text-muted-foreground font-normal">{question.description}</p>
          </div>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-3">
        <FacialEmotionRecognitionChart data={analytics.facial_emotion_recognition} />
        <AudioAnalysis data={analytics.audio} />
        {analytics?.word_cloud && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-center">Word Cloud</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Image
                src={analytics.word_cloud}
                alt="Word Cloud"
                width={500}
                height={300}
                className="w-auto h-[300px]"
              />
            </CardContent>
          </Card>
        )}
        {analytics?.valence_plot && (
          <Card className="col-span-2">
            <CardContent className="pt-6 flex items-center justify-center">
              <Image src={analytics.valence_plot} alt="Valence" width={700} height={500} className="w-auto h-[500px]" />
            </CardContent>
          </Card>
        )}
        {analytics?.ratio_plot && (
          <Card className="col-span-2">
            <CardContent className="pt-6 flex items-center justify-center">
              <Image src={analytics.ratio_plot} alt="Valence" width={700} height={500} className="w-auto h-[500px]" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface CombinedAnalyticsProps {
  session: InterviewSession;
  live?: boolean;
  hideDownloads?: boolean;
}

export function CombinedAnalytics({ session, hideDownloads, live = false }: CombinedAnalyticsProps) {
  const analytics = session.combinedAnalytics;
  if (!analytics) {
    return <AnalyticsFallback error={session.error} live={live} />;
  }
  const { downloadFile } = useDownloadFile();
  const error = console.error;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <div>
      <div className="p-2 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="self-start flex size-8 items-center justify-center rounded-sm border">
            <Combine className="size-3 shrink-0" />
          </div>
          <div>
            <h2 className="font-semibold">Combined Emotion Analytics</h2>
            <p className="text-xs text-muted-foreground font-normal">All analytics combined</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hideDownloads && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.promise(
                  downloadFile({
                    id: session.id,
                    count: 0,
                    name: "data_logs",
                  }),
                  {
                    loading: "Downloading data logs...",
                    success: "Downloaded data logs",
                    error: "Failed to download data logs",
                  },
                )
              }
            >
              <Download className="size-3 mr-2 text-primary" />
              <span>Download</span>
            </Button>
          )}
        </div>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center flex flex-col justify-center items-center gap-6 col-span-2 p-6">
          <h1 className="text-lg font-semibold leading-none tracking-tight">Interview Score</h1>
          <div className="rounded-full bg-muted border shadow h-16 w-16 flex items-center justify-center">
            <CountAnimation number={analytics?.avg_sentiment || 0} className="text-3xl font-black" />
          </div>
        </Card>
        {analytics?.valence_plot && (
          <Card className="col-span-2">
            <CardContent className="pt-6 flex items-center justify-center">
              <Image src={analytics.valence_plot} alt="Valence" width={700} height={500} className="w-auto h-[500px]" />
            </CardContent>
          </Card>
        )}
        {analytics?.ratio_plot && (
          <Card className="col-span-2">
            <CardContent className="pt-6 flex items-center justify-center">
              <Image src={analytics.ratio_plot} alt="Valence" width={700} height={500} className="w-auto h-[500px]" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function AnalyticsFallback({ error, live }: { error?: InterviewSession["error"]; live: boolean }) {
  if (!error && live) {
    return (
      <div className="w-full h-full min-h-96 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <p className="font-semibold text-sm">Still processing, Please wait...</p>
          <Loaders.buttonLoader />
        </div>
      </div>
    );
  }
  if (!error && !live) {
    return (
      <div className="w-full h-full min-h-96 flex items-center justify-center">
        <div className="flex items-center flex-col gap-3">
          <p className="font-semibold text-sm">Might be still in processing, Please wait...</p>
          <p className="text-xs text-muted-foreground">
            Or some error occurred while processing analytics, please try again later or contact support if the issue
            persists
          </p>
        </div>
      </div>
    );
  }
  error = error || { message: "An unknown error occurred while processing analytics", trace: "" };
  return (
    <div className="w-full h-full min-h-96 flex items-center justify-center">
      <Card className="w-full rounded-xl max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center pt-6">
          <Alert variant="destructive" className="">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">Error</AlertTitle>
            <AlertDescription className="break-words space-y-4">
              <div className="mt-4">
                <span className="text-foreground font-semibold text-base">Message: </span>
                <span>{error.message}</span>
              </div>
              {error.trace && (
                <div>
                  <span className="text-foreground font-semibold text-base">Trace: </span>
                  <span>{error.trace}</span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
