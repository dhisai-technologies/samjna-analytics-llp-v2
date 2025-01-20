"use client";

import * as React from "react";

import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";

import type { InterviewSession } from "@config/interview";
import type { DataTableFilterField } from "@config/utils";
import { getColumns } from "./interview-sessions-table-columns";

interface InterviewSessionsTableProps {
  interviewId: string;
  pageCount: number;
  data: InterviewSession[];
}

export function InterviewSessionsTable({ interviewId, data, pageCount }: InterviewSessionsTableProps) {
  const columns = React.useMemo(() => getColumns(interviewId), [interviewId]);

  const filterFields: DataTableFilterField<InterviewSession>[] = [
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
