"use client";

import * as React from "react";

import type { NursingParticipant } from "@config/nursing";
import type { DataTableFilterField } from "@config/utils";
import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";
import { getColumns } from "./nursing-participants-table-columns";

interface NursingParticipantsTableProps {
  nursingTestId: string;
  pageCount: number;
  data: NursingParticipant[];
}

export function NursingParticipantsTable({ data, pageCount, nursingTestId }: NursingParticipantsTableProps) {
  const columns = React.useMemo(() => getColumns(nursingTestId), [nursingTestId]);

  const filterFields: DataTableFilterField<NursingParticipant>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by id",
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
