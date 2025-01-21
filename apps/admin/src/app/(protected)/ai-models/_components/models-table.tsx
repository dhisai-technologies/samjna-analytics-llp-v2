"use client";

import * as React from "react";

import type { DataTableFilterField } from "@config/utils";
import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";

import type { Model } from "@config/core";
import { CreateModelDialog } from "./create-model-dialog";
import { getColumns } from "./models-table-columns";

interface ModelsTableProps {
  pageCount: number;
  data: Model[];
}

export function ModelsTable({ data, pageCount }: ModelsTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Model>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by id, name or key..",
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
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CreateModelDialog />
      </DataTableToolbar>
    </DataTable>
  );
}
