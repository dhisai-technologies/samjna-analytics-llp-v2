"use client";

import * as React from "react";

import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";

import type { NursingSession } from "@config/nursing";
import type { DataTableFilterField } from "@config/utils";
import { getColumns } from "./nursing-sessions-table-columns";

interface NursingSessionsTableProps {
  nursingTestId: string;
  pageCount: number;
  data: NursingSession[];
}

export function NursingSessionsTable({ nursingTestId, data, pageCount }: NursingSessionsTableProps) {
  const columns = React.useMemo(() => getColumns(nursingTestId), [nursingTestId]);

  const filterFields: DataTableFilterField<NursingSession>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by name, id or participant id",
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
