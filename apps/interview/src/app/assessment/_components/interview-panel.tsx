"use client";

import { InterviewSessionPanel } from "@/components/interview-session/interview-session-panel";
import { useInterview } from "@/components/providers/interview-provider";
import { useCoreSocket } from "@ui/components/providers/core-socket-provider";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@ui/components/ui/resizable";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { InterviewQuestionsPanel } from "./interview-questions-panel";
import { InterviewRecordingPanel } from "./interview-recording-panel";

export function InterviewPanel() {
  const { interviewSession } = useCoreSocket();
  const { interview, questions, userId } = useInterview();
  const { logs } = useLogSocket();
  if (interviewSession) {
    return (
      <InterviewSessionPanel
        panelHeight="calc(100vh - 8rem)"
        session={interviewSession}
        interview={interview}
        questions={questions}
        logs={logs}
        live
      />
    );
  }
  return (
    <ResizablePanelGroup direction="horizontal" className="border border-border rounded-md">
      <ResizablePanel defaultSize={25} minSize={20}>
        <ScrollArea className="h-[calc(100vh-theme(spacing.44))] bg-sidebar">
          <InterviewQuestionsPanel />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <ScrollArea className="h-[calc(100vh-theme(spacing.44))]">
          <InterviewRecordingPanel userId={userId} />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
