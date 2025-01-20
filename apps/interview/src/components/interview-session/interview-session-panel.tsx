"use client";

import { getInterviewQuestionTypeIcon } from "@/lib/utils/interview-question";
import type { Interview, InterviewQuestion, InterviewSession } from "@config/interview";
import { LogsPopover } from "@ui/components/logs-popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@ui/components/ui/resizable";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Separator } from "@ui/components/ui/separator";
import { cn } from "@ui/utils";
import { Combine } from "lucide-react";
import { useState } from "react";
import { CombinedAnalytics, IndividualAnalytics } from "../interview-analytics/interview-analytics";
import { InterviewAnalyticsReport } from "../interview-analytics/interview-analytics-report";

interface InterviewSessionPanelProps {
  session: InterviewSession;
  interview: Interview;
  questions: InterviewQuestion[];
  panelHeight?: string;
  live?: boolean;
  logs?: string[];
}

export function InterviewSessionPanel({
  session,
  interview,
  questions,
  live,
  logs,
  panelHeight = "calc(100vh - 11rem)",
}: InterviewSessionPanelProps) {
  const [current, setCurrent] = useState<InterviewQuestion | undefined>();
  return (
    <ResizablePanelGroup direction="horizontal" className="border border-border rounded-md">
      <ResizablePanel defaultSize={25} minSize={20}>
        <ScrollArea
          className="bg-sidebar"
          style={{
            height: panelHeight,
          }}
        >
          <section className="p-3">
            <div className="bg-background p-2 border border-border rounded-md flex justify-between items-start">
              <div className="max-w-44">
                <h2 className="font-semibold truncate">{interview.title}</h2>
                <p className="text-xs truncate text-muted-foreground">{interview.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <InterviewAnalyticsReport session={session} questions={questions} />
                {(logs || session.logs) && (
                  <>
                    {logs && <LogsPopover logs={logs} align="start" side="right" variant="secondary" />}
                    {!logs && session.logs && (
                      <LogsPopover logs={session.logs} align="start" side="right" variant="secondary" />
                    )}
                  </>
                )}
              </div>
            </div>
            <Separator className="my-3" />
            <div className="grid gap-3 text-left">
              <button
                type="button"
                className={cn(
                  "flex gap-3 h-16 items-center border bg-background border-border p-3 rounded-md hover:bg-sidebar-accent",
                  !current && "bg-sidebar-accent",
                )}
                onClick={() => setCurrent(undefined)}
              >
                <div
                  className={cn(
                    "self-start flex size-8 items-center justify-center rounded-sm border",
                    !current && "bg-primary/10 text-primary border-primary/50",
                  )}
                >
                  <Combine className="size-3 shrink-0" />
                </div>
                <div className="self-start flex flex-col items-start">
                  <h3 className="truncate text-sm font-medium">Combined Analytics</h3>
                  <p className="truncate text-muted-foreground text-xs">All analytics combined</p>
                </div>
              </button>
              {questions.map((question) => {
                const Icon = getInterviewQuestionTypeIcon(question.type);
                return (
                  <button
                    key={question.id}
                    type="button"
                    className={cn(
                      "flex gap-3 h-16 items-center border bg-background border-border p-3 rounded-md hover:bg-sidebar-accent",
                      current?.id === question.id && "bg-sidebar-accent",
                    )}
                    onClick={() => setCurrent(question)}
                  >
                    <div
                      className={cn(
                        "self-start flex size-8 items-center justify-center rounded-sm border bg-background",
                        current?.id === question.id && "bg-primary/20 text-primary border-primary/50",
                      )}
                    >
                      <Icon className="size-3 shrink-0" />
                    </div>
                    <div className="self-start flex flex-col items-start max-w-52">
                      <h3 className="truncate text-sm font-medium max-w-52">{question.title}</h3>
                      {question.description && (
                        <p className="truncate text-muted-foreground text-xs max-w-52">{question.description}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <ScrollArea
          style={{
            height: panelHeight,
          }}
        >
          <div className="p-3">
            {!current ? (
              <CombinedAnalytics session={session} live={live} />
            ) : (
              <IndividualAnalytics session={session} question={current} live={live} />
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
