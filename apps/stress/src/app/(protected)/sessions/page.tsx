import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { StressSessionsTable } from "./_components/stress-sessions-table";
import { getStressSessions } from "./_lib/queries";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const result = await getStressSessions(searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { stressSessions, pageCount } = result;
  return (
    <main className="p-3 md:p-6">
      <Card className="space-y-6 w-full md:w-[75vw] mx-auto flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>Sessions</CardTitle>
          <CardDescription>View and analyze previous sessions</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <StressSessionsTable data={stressSessions} pageCount={pageCount} />
        </CardContent>
      </Card>
    </main>
  );
}
