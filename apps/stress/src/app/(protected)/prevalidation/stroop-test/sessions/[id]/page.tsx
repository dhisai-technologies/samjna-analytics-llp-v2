import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { Card } from "@ui/components/ui/card";
import { getStroopTestQuestions } from "../../level-3/_lib/queries";
import { getStroopSession } from "./_lib/queries";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const result = await getStroopSession(params.id);
  const questionsResult = await getStroopTestQuestions("LEVEL-3");
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  if ("error" in questionsResult) {
    return <DataError {...questionsResult.error} />;
  }
  const { session } = result;
  const { stroopTestQuestions } = questionsResult;
  if (stroopTestQuestions.length !== session.individualAnalytics?.length) {
    return (
      <>
        <DataHeader
          title={params.id}
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
            {
              title: "Sessions",
              href: "/prevalidation/stroop-test/sessions",
            },
          ]}
          className="border-b"
        />
        <main className="p-3 w-full h-full">No data available</main>
      </>
    );
  }
  const score = stroopTestQuestions.reduce((acc, question) => {
    if (!session.individualAnalytics) return acc;
    const analytics = session.individualAnalytics.find((q) => q.id === question.id);
    return question.answer.toString() === analytics?.answer?.toString() ? acc + 1 : acc;
  }, 0);
  return (
    <>
      <DataHeader
        title={params.id}
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
          {
            title: "Sessions",
            href: "/prevalidation/stroop-test/sessions",
          },
        ]}
        className="border-b"
      />
      <main className="p-3 w-full h-full">
        <Card className="absolute z-20 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 w-96">
          <dl className="grid gap-3 pb-2 w-full">
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Correct Answers</dt>
              <dd className="font-medium">{score}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Total Questions</dt>
              <dd className="font-medium">{stroopTestQuestions.length}</dd>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <dt className="text-muted-foreground">Accuracy</dt>
              <dd className="font-medium">{((score / stroopTestQuestions.length) * 100).toFixed(2)}%</dd>
            </div>
          </dl>
        </Card>
      </main>
    </>
  );
}
