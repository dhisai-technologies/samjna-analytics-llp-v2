"use client";

import { useDownloadFile } from "@/lib/hooks/use-download-file";
import { getGoldStandardTestScores } from "@/lib/utils/gold-standard-test";
import { getNursingQuestionTypeIcon } from "@/lib/utils/nursing-question";
import type { NursingQuestion, NursingSession } from "@config/nursing";
import { CountAnimation } from "@ui/components/count-animation";
import { Loaders } from "@ui/components/loaders";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/ui/alert";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { AlertCircle, Command, Download } from "lucide-react";
import { toast } from "sonner";
import { ActionUnitDistributionCharts } from "./action-unit-distribution-charts";
import { DisgustDistributionChart } from "./disgust-distribution-chart";
import { EmotionDistributionChart } from "./emotion-distribution-chart";
import { NursingStatistics } from "./nursing-statistics";
import { ValenceAndArousalBoxPlots } from "./valence-and-arousal-box-plots";
import { ValenceAndArousalLinePlots } from "./valence-and-arousal-line-plots";

interface CombinedAnalyticsProps {
  session: NursingSession;
}

export function CombinedAnalytics({ session }: CombinedAnalyticsProps) {
  if (!session.individualAnalytics) {
    return <AnalyticsFallback error={session.error} live={false} />;
  }
  const scores = getGoldStandardTestScores(session.individualAnalytics);
  if (!scores) {
    return <AnalyticsFallback error={session.error} live={false} />;
  }
  let averageDisgustScore = 0;
  for (const analytics of session.individualAnalytics || []) {
    averageDisgustScore += analytics.metadata?.disgust_score || 0;
  }
  averageDisgustScore = averageDisgustScore / (session.individualAnalytics?.length || 1);
  return (
    <div>
      <div className="p-2 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="self-start flex size-8 items-center justify-center rounded-sm border">
            <Command className="size-3 shrink-0" />
          </div>
          <div className="self-start flex flex-col">
            <h2 className="truncate font-semibold">Combined Analytics</h2>
            <p className="truncate text-xs text-muted-foreground font-normal">
              Combined analytics of all questions in the session.
            </p>
          </div>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="grid gap-3 max-w-xl mx-auto">
        <Card className="relative flex flex-col ">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-lg">Disgust Sensitivity Scores</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 items-start w-full">
            <dl className="grid gap-3 pb-2 w-full">
              <div className="flex gap-3 items-center justify-between">
                <dt className="text-muted-foreground">Core Disgust</dt>
                <dd className="font-medium">{scores.coreDisgust}</dd>
              </div>
              <div className="flex gap-3 items-center justify-between">
                <dt className="text-muted-foreground">Animal Reminder Disgust</dt>
                <dd className="font-medium">{scores.animalRemainderDisgust}</dd>
              </div>
              <div className="flex gap-3 items-center justify-between">
                <dt className="text-muted-foreground">Contaminated based disgust</dt>
                <dd className="font-medium">{scores.contaminationDisgust}</dd>
              </div>
              <div className="flex gap-3 items-center justify-between">
                <dt className="text-muted-foreground">Disgust Sensitivity Score (By Interview)</dt>
                <dd className="font-medium">{scores.disgustSensitivity}</dd>
              </div>
              <div className="flex gap-3 items-center justify-between">
                <dt className="text-muted-foreground">Disgust Sensitivity Score (By Model)</dt>
                <dd className="font-medium">{averageDisgustScore.toFixed(2)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface IndividualAnalyticsProps {
  session: NursingSession;
  question: NursingQuestion;
  live?: boolean;
  hideDownloads?: boolean;
}

export function IndividualAnalytics({ session, question, hideDownloads, live = false }: IndividualAnalyticsProps) {
  const analytics = session.individualAnalytics?.find((value) => value.id === question.id);
  if (!analytics) {
    return <AnalyticsFallback error={session.error} live={live} />;
  }
  const Icon = getNursingQuestionTypeIcon(question.type);
  const { downloadFile } = useDownloadFile();
  return (
    <div>
      <div className="p-2 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="self-start flex size-8 items-center justify-center rounded-sm border">
            <Icon className="size-3 shrink-0" />
          </div>
          <div className="self-start flex flex-col">
            <h2 className="truncate font-semibold">{question.title}</h2>
            <p className="truncate text-xs text-muted-foreground font-normal">{question.description}</p>
          </div>
        </div>
        {!hideDownloads && (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                toast.promise(
                  downloadFile({
                    id: session.id,
                    count: analytics.count,
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
              <Download className="size-3 text-primary" />
              <span>Data Logs</span>
            </Button>
          </div>
        )}
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center flex flex-col justify-center items-center gap-6 col-span-2 p-6">
          <h1 className="text-lg font-semibold leading-none tracking-tight">Disgust Sensitivity Score</h1>
          <div className="rounded-full bg-muted border shadow h-16 w-16 flex items-center justify-center">
            <CountAnimation number={analytics.metadata?.disgust_score || 0} className="text-3xl font-black" />
          </div>
        </Card>
        <NursingStatistics data={analytics.metadata} />
        <DisgustDistributionChart data={analytics.metadata} />
        <ActionUnitDistributionCharts data={analytics.metadata} />
        <EmotionDistributionChart data={analytics.metadata} />
        <ValenceAndArousalLinePlots data={analytics.metadata} />
        <ValenceAndArousalBoxPlots data={analytics.metadata} />
      </div>
    </div>
  );
}

interface RecordedAnalyticsProps {
  session: NursingSession;
  live?: boolean;
  hideDownloads?: boolean;
}

export function RecordedAnalytics({ session, hideDownloads, live = false }: RecordedAnalyticsProps) {
  const analytics = session.individualAnalytics?.find((value) => value.id === "combined");
  if (!analytics) {
    return <AnalyticsFallback error={session.error} live={live} />;
  }
  const { downloadFile } = useDownloadFile();
  return (
    <div>
      <div className="p-2 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="self-start flex size-8 items-center justify-center rounded-sm border">
            <Command className="size-3 shrink-0" />
          </div>
          <div className="self-start flex flex-col">
            <h2 className="truncate font-semibold">Combined Analytics</h2>
            <p className="truncate text-xs text-muted-foreground font-normal">
              Combined analytics of recorded video of the session.
            </p>
          </div>
        </div>
        {!hideDownloads && (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                toast.promise(
                  downloadFile({
                    id: session.id,
                    count: analytics.count,
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
              <Download className="size-3 text-primary" />
              <span>Data Logs</span>
            </Button>
          </div>
        )}
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center flex flex-col justify-center items-center gap-6 col-span-2 p-6">
          <h1 className="text-lg font-semibold leading-none tracking-tight">Disgust Sensitivity Score</h1>
          <div className="rounded-full bg-muted border shadow h-16 w-16 flex items-center justify-center">
            <CountAnimation number={analytics.metadata?.disgust_score || 0} className="text-3xl font-black" />
          </div>
        </Card>
        <NursingStatistics data={analytics.metadata} />
        <DisgustDistributionChart data={analytics.metadata} />
        <ActionUnitDistributionCharts data={analytics.metadata} />
        <EmotionDistributionChart data={analytics.metadata} />
        <ValenceAndArousalLinePlots data={analytics.metadata} />
        <ValenceAndArousalBoxPlots data={analytics.metadata} />
      </div>
    </div>
  );
}

function AnalyticsFallback({ error, live }: { error?: NursingSession["error"]; live: boolean }) {
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
