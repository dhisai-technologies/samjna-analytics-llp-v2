import { InterviewProvider } from "@/components/providers/interview-provider";
import { apps } from "@config/ui";
import type { SearchParams } from "@config/utils";
import { LogSocketProvider } from "@ui/components/providers/log-socket-provider";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getInterviewAssessment } from "./_lib/queries";

const InterviewPanel = dynamic(() => import("./_components/interview-panel"), { ssr: false });

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  if (typeof searchParams.interviewId !== "string" || typeof searchParams.participantId !== "string") {
    redirect("/auth/assessment");
  }
  const result = await getInterviewAssessment(searchParams.interviewId, searchParams.participantId);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { interview, questions } = result;
  const app = apps.interview;
  return (
    <main>
      <DataHeader
        title={interview.title}
        variant="raw"
        crumbs={[
          {
            title: app.englishName,
            href: "/",
          },
        ]}
      />
      <div className="px-3 lg:px-6">
        <InterviewProvider interview={interview} questions={questions} userId={searchParams.participantId}>
          <LogSocketProvider url={app.api.socket}>
            <InterviewPanel />
          </LogSocketProvider>
        </InterviewProvider>
      </div>
    </main>
  );
}
