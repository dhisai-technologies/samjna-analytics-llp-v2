import { InterviewSessionPanel } from "@/components/interview-session/interview-session-panel";
import { apps } from "@config/ui";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { getInterview } from "../../_lib/queries";
import { getInterviewSession } from "./_lib/queries";

export default async function Page({
  params,
}: {
  params: { interviewId: string; sessionId: string };
}) {
  const interviewResult = await getInterview(params.interviewId);
  const sessionResult = await getInterviewSession(params.sessionId);
  const app = apps.interview;
  if ("error" in interviewResult) {
    return <DataError {...interviewResult.error} />;
  }
  if ("error" in sessionResult) {
    return <DataError {...sessionResult.error} />;
  }
  const { interview, questions } = interviewResult;
  const { session } = sessionResult;
  return (
    <main>
      <DataHeader
        title="Session"
        variant="raw"
        crumbs={[
          {
            title: app.englishName,
            href: "/",
          },
          {
            title: interview.title,
            href: `/${interview.id}`,
          },
        ]}
      />
      <div className="px-3 lg:px-6">
        <InterviewSessionPanel
          panelHeight="calc(100vh - 8rem)"
          interview={interview}
          session={session}
          questions={questions}
        />
      </div>
    </main>
  );
}
