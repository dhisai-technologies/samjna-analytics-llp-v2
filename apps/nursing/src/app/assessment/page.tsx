import { NursingTestProvider } from "@/components/providers/nursing-test-provider";
import { apps } from "@config/ui";
import type { SearchParams } from "@config/utils";
import { LogSocketProvider } from "@ui/components/providers/log-socket-provider";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getNursingAssessment } from "./_lib/queries";

const NursingTestPanel = dynamic(() => import("./_components/nursing-test-panel"), { ssr: false });

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  if (typeof searchParams.nursingTestId !== "string" || typeof searchParams.participantId !== "string") {
    redirect("/auth/assessment");
  }
  const result = await getNursingAssessment(searchParams.nursingTestId, searchParams.participantId);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { nursingTest, questions } = result;
  const app = apps.nursing;
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
        <NursingTestProvider nursingTest={nursingTest} questions={questions} userId={searchParams.participantId}>
          <LogSocketProvider url={app.api.socket}>
            <NursingTestPanel />
          </LogSocketProvider>
        </NursingTestProvider>
      </div>
    </main>
  );
}
