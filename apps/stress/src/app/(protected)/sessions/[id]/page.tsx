import { StressTestAnalytics } from "@/components/stress-analytics/stress-test-analytics";
import { DataError } from "@ui/components/registry/data-error";
import { getStressSession } from "./_lib/queries";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const result = await getStressSession(params.id);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { session } = result;
  return (
    <main className="p-3 w-full h-full">
      <StressTestAnalytics session={session} />
    </main>
  );
}
