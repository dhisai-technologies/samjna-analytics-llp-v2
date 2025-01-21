"use client";

import type { NursingParticipant } from "@config/nursing";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@ui/components/registry/data-table/data-table-column-header";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { cn } from "@ui/utils";
import { getErrorMessage } from "@utils/helpers";
import { format } from "date-fns";
import { Ellipsis, PieChart, ShieldCheck, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateNursingParticipantStatus } from "../_lib/actions";

export function getColumns(nursingTestId: string): ColumnDef<NursingParticipant>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
      cell: ({ row }) => <span>{row.original.uid}</span>,
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <Badge
              variant={row.original.active ? "default" : "destructive"}
              className={cn(row.original.active && "bg-green-100 text-green-700 hover:bg-green-200")}
            >
              {row.original.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
      cell: ({ row }) => <span>{format(row.original.createdAt, "ccc dd MMM hh:mm a")}</span>,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const router = useRouter();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onSelect={() => router.push(`/${nursingTestId}?tab=sessions&search=${row.original.id}`)}
                className="space-x-2 cursor-pointer"
              >
                <PieChart className="w-3 h-3" />
                <span>View Sessions</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  toast.promise(updateNursingParticipantStatus(row.original.id, !row.original.active), {
                    loading: "Updating status...",
                    success: "Updated status successfully",
                    error: (err) => getErrorMessage(err),
                  });
                }}
                className="space-x-2 cursor-pointer"
              >
                {row.original.active ? <ShieldX className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3 " />}
                {row.original.active ? <span>Deactivate</span> : <span>Activate</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
