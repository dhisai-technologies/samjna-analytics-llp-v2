import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { StroopSessionsTable } from "./_components/stroop-sessions-table";
import { getStroopSessions } from "./_lib/queries";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const result = await getStroopSessions(searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { stroopTestSessions, pageCount } = result;
  return (
    <>
      <DataHeader
        title="Sessions"
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
      <main className="p-3 md:p-6">
        <StroopSessionsTable data={stroopTestSessions} pageCount={pageCount} />
      </main>
    </>
  );
}
