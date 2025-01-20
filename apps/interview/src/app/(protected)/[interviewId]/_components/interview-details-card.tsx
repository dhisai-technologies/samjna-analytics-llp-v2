"use client";

import { useInterview } from "@/components/providers/interview-provider";
import { Card, CardContent } from "@ui/components/ui/card";
import { convertEnumToReadableFormat } from "@utils/helpers";
import { format } from "date-fns";

export function InterviewDetailsCard() {
  const { interview } = useInterview();
  return (
    <Card className="overflow-hidden flex-1 border-transparent shadow-none min-w-60">
      <CardContent className="py-0 px-3 text-xs grid gap-1">
        <dl className="grid gap-3 pb-2">
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Level</dt>
            <dd>{convertEnumToReadableFormat(interview.level)}</dd>
          </div>
          <div className="flex gap-3 items-center justify-between font-semibold">
            <dt className="text-muted-foreground">Start Time</dt>
            <dd>{format(interview.startTime, "ccc dd MMM hh:mm a")}</dd>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Created At</dt>
            <dd>{format(interview.createdAt, "ccc dd MMM hh:mm a")}</dd>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <dt className="text-muted-foreground">Updated At</dt>
            <dd>{format(interview.updatedAt, "ccc dd MMM hh:mm a")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
