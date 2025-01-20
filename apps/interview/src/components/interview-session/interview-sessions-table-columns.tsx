"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/components/registry/data-table/data-table-column-header";

import { deleteInterviewSession } from "@/lib/actions";
import type { InterviewSession } from "@config/interview";
import { useAuth } from "@ui/components/providers/auth-provider";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { getErrorMessage } from "@utils/helpers";
import { format } from "date-fns";
import { Ellipsis, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function getColumns(interviewId: string): ColumnDef<InterviewSession>[] {
  return [
    {
      accessorKey: "Id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
      cell: ({ row }) => <span>{row.original.uid}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "createAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
      cell: ({ row }) => <span>{format(row.original.createdAt, "ccc dd MMM hh:mm a")}</span>,
    },
    {
      accessorKey: "userId",
      header: "Participant",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.original.userId}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const { user } = useAuth();
        if (user.role !== "ORGANIZATION") {
          return (
            <div className="flex space-x-2">
              <Button aria-label="View session" variant="ghost" size="icon" asChild>
                <Link href={`${interviewId}/sessions/${row.original.id}`}>
                  <Eye className="size-4 text-primary" />
                </Link>
              </Button>
            </div>
          );
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem className="space-x-2 cursor-pointer" asChild>
                <Link href={`${interviewId}/sessions/${row.original.id}`}>
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  toast.promise(deleteInterviewSession(row.original.id), {
                    loading: "Deleting session...",
                    success: () => {
                      return "Session deleted successfully";
                    },
                    error: (res) => {
                      return getErrorMessage(res);
                    },
                  });
                }}
                className="space-x-2 cursor-pointer"
              >
                <Trash className="w-3 h-3 text-destructive" />
                <span className="text-destructive">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
