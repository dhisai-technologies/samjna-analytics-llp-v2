import { apps } from "@config/ui";
import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { ModelsTable } from "./_components/models-table";
import { getModels } from "./_lib/queries";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const result = await getModels(searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { models, pageCount } = result;
  const app = apps.admin;
  return (
    <main>
      <DataHeader
        crumbs={[
          {
            title: app.englishName,
          },
        ]}
        title="Models"
        className="h-14"
      />
      <ScrollArea className="h-[calc(100vh-theme(spacing.20))]">
        <div className="p-3 lg:p-6 lg:pt-3 grid gap-3">
          <ModelsTable data={models} pageCount={pageCount} />
        </div>
      </ScrollArea>
    </main>
  );
}
