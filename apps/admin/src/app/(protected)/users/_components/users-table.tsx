"use client";

import { type User, modules, roles } from "@config/core";

import * as React from "react";

import type { DataTableFilterField } from "@config/utils";
import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";

import { convertEnumToReadableFormat } from "@utils/helpers";
import { CreateUserDialog } from "./create-user-dialog";
import { getColumns } from "./users-table-columns";

interface UsersTableProps {
  pageCount: number;
  data: User[];
}

export function UsersTable({ data, pageCount }: UsersTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<User>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by name, email..",
    },
    {
      label: "Roles",
      value: "role",
      placeholder: "Filter by roles",
      options: roles
        .filter((value) => !["ADMIN"].includes(value))
        .map((value) => ({ value, label: convertEnumToReadableFormat(value) })),
    },
    {
      label: "Modules",
      value: "module",
      placeholder: "Filter by modules",
      options: modules
        .filter((value) => !["ADMIN"].includes(value))
        .map((value) => ({ value, label: convertEnumToReadableFormat(value) })),
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    defaultPerPage: 5,
  });

  return (
    <DataTable table={table} className="w-full">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <div className="flex items-center gap-2">
          <CreateUserDialog />
        </div>
      </DataTableToolbar>
    </DataTable>
  );
}
