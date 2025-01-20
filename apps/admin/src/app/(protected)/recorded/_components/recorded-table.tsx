"use client";

import * as React from "react";

import type { DataTableFilterField } from "@config/utils";
import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";

import type { File } from "@config/core";
import { getColumns } from "./recorded-table-columns";

interface RecordedTableProps {
  pageCount: number;
  data: File[];
}

export function RecordedTable({ data, pageCount }: RecordedTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<File>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by id, name, key or owner email..",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    defaultPerPage: 5,
    hiddenColumns: {
      level: false,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
