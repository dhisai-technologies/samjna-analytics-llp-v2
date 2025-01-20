import { InterviewSessionsTable } from "@/components/interview-session/interview-sessions-table";
import { InterviewProvider } from "@/components/providers/interview-provider";
import { apps } from "@config/ui";
import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { DataTabs, DataTabsContent, DataTabsList, DataTabsTrigger } from "@ui/components/registry/data-tabs";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { getSessionUser } from "@utils/server";
import { InterviewDetailsCard } from "./_components/interview-details-card";
import { InterviewParticipantsTable } from "./_components/interview-participants-table";
import { InterviewQuestionsList } from "./_components/interview-questions-list";
import { getInterview, getInterviewParticipants, getInterviewSessions } from "./_lib/queries";

async function ParticipantsTab({ interviewId, searchParams }: { interviewId: string; searchParams: SearchParams }) {
  const result = await getInterviewParticipants(interviewId, searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { interviewParticipants, pageCount } = result;
  return (
    <DataTabsContent value="participants">
      <InterviewParticipantsTable interviewId={interviewId} data={interviewParticipants} pageCount={pageCount} />
    </DataTabsContent>
  );
}

async function SessionsTab({ interviewId, searchParams }: { interviewId: string; searchParams: SearchParams }) {
  const result = await getInterviewSessions(interviewId, searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { interviewSessions, pageCount } = result;
  return (
    <DataTabsContent value="sessions">
      <InterviewSessionsTable interviewId={interviewId} data={interviewSessions} pageCount={pageCount} />
    </DataTabsContent>
  );
}

export default async function Page({
  searchParams,
  params,
}: {
  params: { interviewId: string };
  searchParams: SearchParams;
}) {
  const user = getSessionUser();
  const result = await getInterview(params.interviewId);
  const app = apps.interview;
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { interview, questions } = result;
  const queryParams = new URLSearchParams(searchParams as Record<string, string>);
  const tab = queryParams.get("tab");

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
        <DataTabs defaultValue="dashboard">
          <DataTabsList>
            <DataTabsTrigger value="dashboard">Dashboard</DataTabsTrigger>
            <DataTabsTrigger value="participants">Participants</DataTabsTrigger>
            <DataTabsTrigger value="sessions">Sessions</DataTabsTrigger>
          </DataTabsList>
          <ScrollArea className="h-[calc(100vh-10rem)] p-1">
            <DataTabsContent value="dashboard" className="mt-3">
              <InterviewProvider interview={interview} questions={questions} userId={user.id}>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <InterviewQuestionsList />
                  <InterviewDetailsCard />
                </div>
              </InterviewProvider>
            </DataTabsContent>
            {tab === "sessions" && <SessionsTab interviewId={interview.id} searchParams={searchParams} />}
            {tab === "participants" && <ParticipantsTab interviewId={interview.id} searchParams={searchParams} />}
          </ScrollArea>
        </DataTabs>
      </div>
    </main>
  );
}
