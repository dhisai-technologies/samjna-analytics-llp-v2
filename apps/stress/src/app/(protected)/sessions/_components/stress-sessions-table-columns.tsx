"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/components/registry/data-table/data-table-column-header";

import type { StressSession } from "@config/stress";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteStressSession } from "../_lib/actions";

export function getColumns(): ColumnDef<StressSession>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
      cell: ({ row }) => <span>{format(row.original.createdAt, "ccc dd MMM hh:mm a")}</span>,
    },
    {
      id: "user.email",
      accessorKey: "user.email",
      header: "Analyzed By",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("user.email")}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const router = useRouter();
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  onSelect={() => {
                    router.push(`/sessions/${row.original.id}`);
                  }}
                  className="space-x-2 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    toast.promise(deleteStressSession(row.original.id), {
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
          </>
        );
      },
    },
  ];
}
