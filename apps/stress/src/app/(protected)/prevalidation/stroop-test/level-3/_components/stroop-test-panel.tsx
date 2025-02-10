"use client";

import { useStroopTest } from "@/components/providers/stroop-test-provider";
import { useCoreSocket } from "@ui/components/providers/core-socket-provider";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { StroopRecordingPanel } from "./stroop-recording-panel";

export default function StroopTestPanel() {
  const { nursingSession } = useCoreSocket();
  const { userId } = useStroopTest();
  if (nursingSession) {
    return <div>Done...</div>;
  }
  return (
    <ScrollArea className="h-[calc(100vh-7rem)]">
      <StroopRecordingPanel userId={userId} />
    </ScrollArea>
  );
}
