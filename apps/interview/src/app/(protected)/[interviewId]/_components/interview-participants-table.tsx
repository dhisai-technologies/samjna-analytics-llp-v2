"use client";

import * as React from "react";

import { DataTable } from "@ui/components/registry/data-table/data-table";
import { DataTableToolbar } from "@ui/components/registry/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";

import type { InterviewParticipant } from "@config/interview";
import type { DataTableFilterField } from "@config/utils";
import { getColumns } from "./interview-participants-table-columns";

interface InterviewParticipantsTableProps {
  interviewId: string;
  pageCount: number;
  data: InterviewParticipant[];
}

export function InterviewParticipantsTable({ data, pageCount, interviewId }: InterviewParticipantsTableProps) {
  const columns = React.useMemo(() => getColumns(interviewId), [interviewId]);

  const filterFields: DataTableFilterField<InterviewParticipant>[] = [
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
