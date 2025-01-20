import { NursingSessionPanel } from "@/components/nursing-session/nursing-session-panel";
import { apps } from "@config/ui";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { getNursingTest } from "../../_lib/queries";
import { getNursingSession } from "./_lib/queries";

export default async function Page({
  params,
}: {
  params: { nursingTestId: string; sessionId: string };
}) {
  const nursingTestResult = await getNursingTest(params.nursingTestId);
  const sessionResult = await getNursingSession(params.sessionId);
  const app = apps.nursing;
  if ("error" in nursingTestResult) {
    return <DataError {...nursingTestResult.error} />;
  }
  if ("error" in sessionResult) {
    return <DataError {...sessionResult.error} />;
  }
  const { nursingTest, questions } = nursingTestResult;
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
            title: nursingTest.title,
            href: `/${nursingTest.id}`,
          },
        ]}
      />
      <div className="px-3 lg:px-6">
        <NursingSessionPanel
          panelHeight="calc(100vh - 8rem)"
          nursingTest={nursingTest}
          session={session}
          questions={questions}
        />
      </div>
    </main>
  );
}
