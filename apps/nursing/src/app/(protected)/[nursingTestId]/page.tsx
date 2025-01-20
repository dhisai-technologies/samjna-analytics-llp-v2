import { NursingSessionsTable } from "@/components/nursing-session/nursing-sessions-table";
import { NursingTestProvider } from "@/components/providers/nursing-test-provider";
import { apps } from "@config/ui";
import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { DataTabs, DataTabsContent, DataTabsList, DataTabsTrigger } from "@ui/components/registry/data-tabs";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { getSessionUser } from "@utils/server";
import { NursingParticipantsTable } from "./_components/nursing-participants-table";
import { NursingQuestionsList } from "./_components/nursing-questions-list";
import { NursingTestDetailsCard } from "./_components/nursing-test-details-card";
import { getNursingParticipants, getNursingSessions, getNursingTest } from "./_lib/queries";

async function ParticipantsTab({ nursingTestId, searchParams }: { nursingTestId: string; searchParams: SearchParams }) {
  const result = await getNursingParticipants(nursingTestId, searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { nursingParticipants, pageCount } = result;
  return (
    <DataTabsContent value="participants">
      <NursingParticipantsTable nursingTestId={nursingTestId} data={nursingParticipants} pageCount={pageCount} />
    </DataTabsContent>
  );
}

async function SessionsTab({ nursingTestId, searchParams }: { nursingTestId: string; searchParams: SearchParams }) {
  const result = await getNursingSessions(nursingTestId, searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { nursingSessions, pageCount } = result;
  return (
    <DataTabsContent value="sessions">
      <NursingSessionsTable nursingTestId={nursingTestId} data={nursingSessions} pageCount={pageCount} />
    </DataTabsContent>
  );
}

export default async function Page({
  searchParams,
  params,
}: {
  params: { nursingTestId: string };
  searchParams: SearchParams;
}) {
  const user = getSessionUser();
  const result = await getNursingTest(params.nursingTestId);
  const app = apps.nursing;
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { nursingTest, questions } = result;
  const queryParams = new URLSearchParams(searchParams as Record<string, string>);
  const tab = queryParams.get("tab");

  return (
    <main>
      <DataHeader
        title={nursingTest.title}
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
              <NursingTestProvider nursingTest={nursingTest} questions={questions} userId={user.id}>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <NursingQuestionsList />
                  <NursingTestDetailsCard />
                </div>
              </NursingTestProvider>
            </DataTabsContent>
            {tab === "sessions" && <SessionsTab nursingTestId={nursingTest.id} searchParams={searchParams} />}
            {tab === "participants" && <ParticipantsTab nursingTestId={nursingTest.id} searchParams={searchParams} />}
          </ScrollArea>
        </DataTabs>
      </div>
    </main>
  );
}
