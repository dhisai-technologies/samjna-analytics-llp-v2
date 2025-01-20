"use client";
import type { InterviewQuestion, InterviewSession } from "@config/interview";
import { Button } from "@ui/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@ui/components/ui/dialog";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Download } from "lucide-react";
import { useState } from "react";
import { usePDF } from "react-to-pdf";
import { toast } from "sonner";
import { CombinedAnalytics, IndividualAnalytics } from "./interview-analytics";

interface InterviewAnalyticsReportProps {
  questions: InterviewQuestion[];
  session: InterviewSession;
}

export function InterviewAnalyticsReport({ questions, session }: InterviewAnalyticsReportProps) {
  const [open, setOpen] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: `report-${session.id}.pdf` });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Download className="size-3" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[75vw]" hideClose>
        <ScrollArea className="h-[70vh]">
          <div className="flex flex-col gap-3 p-2">
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toPDF();
                  toast.success("Report downloaded successfully");
                  setOpen(false);
                }}
              >
                Download
              </Button>
            </div>
            <div ref={targetRef} className="flex flex-col gap-6">
              <CombinedAnalytics session={session} hideDownloads />
              {questions
                .filter((question) => question.recordVideo)
                .map((question) => (
                  <IndividualAnalytics key={question.id} question={question} session={session} />
                ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
