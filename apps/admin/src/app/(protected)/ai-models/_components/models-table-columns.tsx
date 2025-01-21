"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { Model } from "@config/core";
import { DataTableColumnHeader } from "@ui/components/registry/data-table/data-table-column-header";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { formatBytes, getErrorMessage } from "@utils/helpers";
import { format } from "date-fns";
import { Copy, Ellipsis, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteModel } from "../_lib/actions";

export function getColumns(): ColumnDef<Model>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.original.name}</span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "mimetype",
      header: "Mimetype",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.original.mimetype}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{formatBytes(row.original.size)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <span>{format(row.original.createdAt, "ccc dd MMM hh:mm a")}</span>,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(row.original.id);
                  toast.success("Model ID copied to clipboard");
                }}
                className="space-x-2 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Model ID</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  toast.promise(deleteModel(row.original.id), {
                    loading: "Deleting file...",
                    success: () => {
                      return "File deleted successfully";
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
