import { apps } from "@config/ui";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { NursingQuestionsList } from "./_components/nursing-questions-list";
import { getNursingQuestions } from "./_lib/queries";

export default async function Page() {
  const result = await getNursingQuestions();
  const app = apps.admin;
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { coreNursingQuestions } = result;
  return (
    <main>
      <DataHeader
        crumbs={[
          {
            title: app.englishName,
          },
        ]}
        title="Nursing Questions"
        className="h-14"
      />
      <ScrollArea className="h-[calc(100vh-theme(spacing.20))]">
        <div className="p-3 lg:p-6 lg:pt-3 grid gap-3">
          <NursingQuestionsList questions={coreNursingQuestions} />
        </div>
      </ScrollArea>
    </main>
  );
}
