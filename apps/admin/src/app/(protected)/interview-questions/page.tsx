import { apps } from "@config/ui";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { InterviewQuestionsList } from "./_components/interview-questions-list";
import { getInterviewQuestions } from "./_lib/queries";

export default async function Page() {
  const result = await getInterviewQuestions();
  const app = apps.admin;
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { coreInterviewQuestions } = result;
  return (
    <main>
      <DataHeader
        crumbs={[
          {
            title: app.englishName,
          },
        ]}
        title="Interview Questions"
        className="h-14"
      />
      <ScrollArea className="h-[calc(100vh-theme(spacing.20))]">
        <div className="p-3 lg:p-6 lg:pt-3 grid gap-3">
          <InterviewQuestionsList questions={coreInterviewQuestions} />
        </div>
      </ScrollArea>
    </main>
  );
}
