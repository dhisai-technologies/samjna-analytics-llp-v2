import { StroopTestProvider } from "@/components/providers/stroop-test-provider";
import { apps } from "@config/ui";
import { LogSocketProvider } from "@ui/components/providers/log-socket-provider";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { getSessionUser } from "@utils/server";
import dynamic from "next/dynamic";
import { getStroopTestQuestions } from "./_lib/queries";

const StroopTestPanel = dynamic(() => import("./_components/stroop-test-panel"), { ssr: false });

export default async function Page() {
  const app = apps.nursing;
  const user = getSessionUser();
  const result = await getStroopTestQuestions("LEVEL-3");
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { stroopTestQuestions } = result;
  return (
    <main className="relative w-full h-[calc(100vh-theme(spacing.14))] bg-background ">
      <DataHeader
        title="Level 3"
        variant="raw"
        crumbs={[
          {
            title: "Prevalidation",
            href: "/prevalidation",
          },
          {
            title: "Stroop Test",
            href: "/prevalidation/stroop-test",
          },
        ]}
        className="border-b"
      />
      <div className="px-3 lg:px-6">
        <StroopTestProvider questions={stroopTestQuestions} userId={user.id}>
          <LogSocketProvider url={app.api.socket}>
            <StroopTestPanel />
          </LogSocketProvider>
        </StroopTestProvider>
      </div>
    </main>
  );
}
