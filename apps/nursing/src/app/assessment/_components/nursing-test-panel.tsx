"use client";

import { NursingSessionPanel } from "@/components/nursing-session/nursing-session-panel";
import { useNursingTest } from "@/components/providers/nursing-test-provider";
import { useCoreSocket } from "@ui/components/providers/core-socket-provider";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@ui/components/ui/resizable";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { NursingQuestionsPanel } from "./nursing-questions-panel";
import { NursingRecordingPanel } from "./nursing-recording-panel";

export function NursingTestPanel() {
  const { nursingSession } = useCoreSocket();
  const { nursingTest, questions, userId } = useNursingTest();
  const { logs } = useLogSocket();
  if (nursingSession) {
    return (
      <NursingSessionPanel
        panelHeight="calc(100vh - 8rem)"
        session={nursingSession}
        nursingTest={nursingTest}
        questions={questions}
        logs={logs}
        live
      />
    );
  }
  return (
    <ResizablePanelGroup direction="horizontal" className="border border-border rounded-md">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={25}>
        <ScrollArea className="h-[calc(100vh-theme(spacing.44))] bg-sidebar">
          <NursingQuestionsPanel />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <ScrollArea className="h-[calc(100vh-theme(spacing.44))]">
          <NursingRecordingPanel userId={userId} />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
