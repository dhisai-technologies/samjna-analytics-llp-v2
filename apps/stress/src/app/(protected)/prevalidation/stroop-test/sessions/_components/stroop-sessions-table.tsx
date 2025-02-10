"use client";

import * as React from "react";

import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";

import type { StroopTestSession } from "@config/stress";
import type { DataTableFilterField } from "@config/utils";
import { getColumns } from "./stroop-sessions-table-columns";

interface StroopSessionsTableProps {
  pageCount: number;
  data: StroopTestSession[];
}

export function StroopSessionsTable({ data, pageCount }: StroopSessionsTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<StroopTestSession>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by name, email..",
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
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
