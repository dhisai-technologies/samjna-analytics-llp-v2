import { apps } from "@config/ui";
import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { DataHeader } from "@ui/components/registry/data-header";
import { UsersTable } from "./_components/users-table";
import { getUsers } from "./_lib/queries";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const result = await getUsers(searchParams);
  const app = apps.admin;
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { pageCount, users } = result;
  return (
    <main>
      <DataHeader
        crumbs={[
          {
            title: app.englishName,
          },
        ]}
        title="User Management"
        className="h-14"
      />
      <div className="p-3 lg:p-6 lg:pt-3 grid gap-3">
        <UsersTable data={users} pageCount={pageCount} />
      </div>
    </main>
  );
}
