"use client";

import { getNursingQuestionTypeIcon } from "@/lib/utils/nursing-question";
import type { NursingQuestion, NursingSession, NursingTest } from "@config/nursing";
import { LogsPopover } from "@ui/components/logs-popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@ui/components/ui/resizable";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Separator } from "@ui/components/ui/separator";
import { cn } from "@ui/utils";
import { Command } from "lucide-react";
import { useEffect, useState } from "react";
import { CombinedAnalytics, IndividualAnalytics, RecordedAnalytics } from "../nursing-analytics/nursing-analytics";
import { NursingReport } from "../nursing-analytics/nursing-report";

interface NursingSessionPanelProps {
  session: NursingSession;
  nursingTest: NursingTest;
  questions: NursingQuestion[];
  panelHeight?: string;
  live?: boolean;
  logs?: string[];
}

export function NursingSessionPanel({
  session,
  nursingTest,
  questions,
  live,
  logs,
  panelHeight = "calc(100vh - 11rem)",
}: NursingSessionPanelProps) {
  const [current, setCurrent] = useState<NursingQuestion | undefined>(undefined);
  const recorded = session.individualAnalytics?.find((value) => value.id === "combined");
  const error = console.error;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  useEffect(() => {
    if (!recorded && live) {
      setCurrent(questions.filter((question) => question.type !== "SELECT")[0]);
    }
  }, [recorded, questions, live]);

  return (
    <ResizablePanelGroup direction="horizontal" className="border border-border rounded-md">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={25}>
        <ScrollArea
          className="bg-sidebar"
          style={{
            height: panelHeight,
          }}
        >
          <section className="p-3">
            <div className="bg-background p-2 border border-border rounded-md flex justify-between items-start">
              <div className="max-w-44">
                <h2 className="font-semibold truncate">{nursingTest.title}</h2>
                <p className="text-xs truncate text-muted-foreground">{nursingTest.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <NursingReport session={session} questions={questions} />
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
                  <Command className="size-3 shrink-0" />
                </div>
                <div className="self-start flex flex-col items-start">
                  <h3 className="truncate text-sm font-medium">Combined Analytics</h3>
                  <p className="truncate text-muted-foreground text-xs">View combined analytics of all questions</p>
                </div>
              </button>
              {!recorded &&
                questions
                  .filter((question) => question.recordVideo)
                  .map((question) => {
                    const Icon = getNursingQuestionTypeIcon(question.type);
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
              <>
                {recorded ? (
                  <RecordedAnalytics session={session} live={live} />
                ) : (
                  <CombinedAnalytics session={session} />
                )}
              </>
            ) : (
              <IndividualAnalytics session={session} question={current} live={live} />
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
