"use client";

import { useDownloadFile } from "@/lib/hooks/download-file";
import { type StressAnalytics, type StressSession, stressQuestions } from "@config/stress";
import { Loaders } from "@ui/components/loaders";
import { LogsPopover } from "@ui/components/logs-popover";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/ui/alert";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent } from "@ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { AlertCircle, Download, Eye, FilePieChart, ScanFace } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { toast } from "sonner";
import { EyeEmotionRecognitionChart } from "./eye-emotion-recognition-chart";
import { FacialEmotionRecognitionChart } from "./facial-emotion-recognition-chart";
import { SpeechEmotionRecognitionChart } from "./speech-emotion-recognition-chart";

interface StressTestAnalyticsProps {
  session: StressSession;
  liveLogs?: string[];
}

export function StressTestAnalytics({ session, liveLogs }: StressTestAnalyticsProps) {
  const { toPDF, targetRef } = usePDF({ filename: "analytics.pdf" });
  const { downloadFile } = useDownloadFile();
  if (session.error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full rounded-xl max-w-4xl mx-auto">
          <CardContent className="flex flex-col items-center pt-6">
            <Alert variant="destructive" className="">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Error</AlertTitle>
              <AlertDescription className="break-words space-y-4">
                <div className="mt-4">
                  <span className="text-foreground font-semibold text-base">Message: </span>
                  <span>{session.error.message}</span>
                </div>
                <div>
                  <span className="text-foreground font-semibold text-base">Trace: </span>
                  <span>{session.error.trace}</span>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }
  const error = console.error;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <Card className="w-full rounded-xl">
      <CardContent className="flex flex-col items-center pt-6" ref={targetRef}>
        {liveLogs && !session.combinedAnalytics && (
          <div className="bg-muted p-3 mb-3 rounded-md flex w-full justify-between items-center">
            <div className="flex items-center gap-3">
              <p className="font-semibold text-sm">Processing Other Emotion Analytics, Please wait...</p>
              <Loaders.buttonLoader />
            </div>
            <LogsPopover logs={liveLogs} />
          </div>
        )}
        {session.combinedAnalytics && (
          <div className="space-y-3 w-full">
            <div className="bg-muted p-3 rounded-md flex justify-between items-center">
              <div>
                <h1 className="font-semibold">Combined Emotion Analytics</h1>
                <p className="text-xs text-muted-foreground">
                  This section shows the analytics of combined emotions based on facial, eye, and speech recognition.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {liveLogs && <LogsPopover logs={liveLogs} />}
                {!liveLogs && session.logs && <LogsPopover logs={session.logs} />}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="size-3 mr-2 text-primary" />
                      <span>Download</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => toPDF()}>
                      <FilePieChart className="size-3 text-primary" />
                      <span>Entire Report</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onSelect={() =>
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
                      <ScanFace className="size-3 text-primary" />
                      <span>Data Logs</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onSelect={() =>
                        toast.promise(
                          downloadFile({
                            id: session.id,
                            count: 0,
                            name: "speech_logs",
                          }),
                          {
                            loading: "Downloading speech logs...",
                            success: "Downloaded speech logs",
                            error: "Failed to download speech logs",
                          },
                        )
                      }
                    >
                      <Eye className="size-3 text-primary" />
                      <span>Speech Logs</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 py-3">
              <FacialEmotionRecognitionChart data={session.combinedAnalytics.facial_emotion_recognition} />
              <SpeechEmotionRecognitionChart data={session.combinedAnalytics.speech_emotion_recognition} />
              <EyeEmotionRecognitionChart data={session.combinedAnalytics.eye_emotion_recognition} />
            </div>
          </div>
        )}
        {session.individualAnalytics && (
          <div className="space-y-3 w-full">
            <div className="bg-muted p-3 rounded-md text-center">
              <h1 className="font-semibold">Individual Emotion Analytics</h1>
              <p className="text-xs text-muted-foreground">
                These are segment wise analytics for each question based on facial, eye, and speech recognition.
              </p>
            </div>
            <div className="w-full">
              {session.individualAnalytics
                .sort((a, b) => a.id - b.id)
                .map((analytics) => (
                  <IndividualEmotionAnalytics key={analytics.id} analytics={analytics} />
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function IndividualEmotionAnalytics({ analytics }: { analytics: StressAnalytics }) {
  const words = stressQuestions[analytics.id - 1];
  if (!words) return null;
  const question = words.map((word) => word.text).join(" ");
  const { toPDF, targetRef } = usePDF({ filename: `analytics-${analytics.id}.pdf` });
  return (
    <div>
      <div className="p-3 font-semibold bg-muted rounded-md flex justify-between items-center">
        <h2>
          {analytics.id}. {question}
        </h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => toPDF()}>
          <Download className="size-3 text-primary" />
          <span>Report</span>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-5 py-3" ref={targetRef}>
        <FacialEmotionRecognitionChart data={analytics.facial_emotion_recognition} />
        <SpeechEmotionRecognitionChart data={analytics.speech_emotion_recognition} />
        <EyeEmotionRecognitionChart data={analytics.eye_emotion_recognition} />
      </div>
    </div>
  );
}
