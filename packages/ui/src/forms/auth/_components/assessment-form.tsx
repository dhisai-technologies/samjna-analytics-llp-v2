"use client";
import type { Module } from "@config/core";
import { apps } from "@config/ui";
import type { SearchParams } from "@config/utils";
import { Icons } from "@ui/components/icons";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Input } from "@ui/components/ui/input";
import { cn } from "@ui/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AssessmentFormProps extends React.ComponentPropsWithRef<typeof Card> {
  module: Module;
  assessmentSearchParam: string;
  searchParams: SearchParams;
}

export function AssessmentForm({
  module,
  assessmentSearchParam,
  searchParams,
  className,
  ...props
}: AssessmentFormProps) {
  const app = Object.values(apps).find((app) => app.key === module);
  if (!app) return null;
  const [resourceId, setResourceId] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [searchParamExists, setSearchParamExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (searchParams[assessmentSearchParam] && typeof searchParams[assessmentSearchParam] === "string") {
      setSearchParamExists(true);
      setResourceId(searchParams[assessmentSearchParam]);
    }
    if (searchParams.participantId && typeof searchParams.participantId === "string") {
      setParticipantId(searchParams.participantId);
    }
  }, [searchParams, assessmentSearchParam]);
  return (
    <Card className={cn("border-none shadow-none w-full", className)} {...props}>
      <CardHeader className="p-0 flex flex-col space-y-2">
        <CardTitle>{`Welcome to ${app.name}`}</CardTitle>
        <CardDescription>Please enter your details to continue</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-6 w-full min-w-[280px] sm:min-w-96 flex flex-col gap-6">
        <div className="grid gap-4">
          {!searchParamExists && (
            <Input
              placeholder={`Enter ${app.englishName} ID`}
              value={resourceId}
              onChange={(e) => setResourceId(e.currentTarget.value)}
            />
          )}
          <Input
            placeholder="Enter Participant Code"
            value={participantId}
            onChange={(e) => setParticipantId(e.currentTarget.value)}
          />
          <Button
            onClick={() => {
              setLoading(true);
              router.push(`/assessment?${assessmentSearchParam}=${resourceId}&participantId=${participantId}`);
            }}
            disabled={!resourceId || !participantId || loading}
          >
            {loading ? <Icons.spinner caption="Loading ..." /> : <span>Continue to assessment</span>}
          </Button>
          <Link href="/auth/login" className={buttonVariants({ variant: "link" })}>
            Proceed to login
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
