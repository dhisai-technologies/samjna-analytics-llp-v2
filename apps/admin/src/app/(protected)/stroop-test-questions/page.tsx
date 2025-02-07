import { apps } from "@config/ui";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { StroopTestQuestionsList } from "./_components/stroop-test-questions-list";
import { getStroopTestQuestions } from "./_lib/queries";

export default async function Page() {
  const app = apps.admin;
  const result = await getStroopTestQuestions();
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { stroopTestQuestions } = result;
  return (
    <main>
      <DataHeader
        crumbs={[
          {
            title: app.englishName,
          },
        ]}
        title="Stroop Test Questions"
        className="h-14"
      />
      <ScrollArea className="h-[calc(100vh-theme(spacing.20))]">
        <div className="p-3 lg:p-6 lg:pt-3 grid gap-3">
          <StroopTestQuestionsList questions={stroopTestQuestions} />
        </div>
      </ScrollArea>
    </main>
  );
}
