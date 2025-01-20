"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import * as React from "react";

import type { DataTableFilterField } from "@config/utils";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { cn } from "@ui/utils";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options && field.value !== "search"),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);
  const globalSearch = filterFields.find((field) => field.value === "search");
  return (
    <div className={cn("flex w-full items-center justify-between space-x-2 overflow-auto p-1", className)} {...props}>
      <div className="flex flex-1 items-center space-x-2">
        <div className="mr-auto flex space-x-2 items-center flex-1 md:grow-0">
          {globalSearch && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                key={String(globalSearch.value)}
                placeholder={globalSearch.placeholder}
                value={(table.getColumn(String(globalSearch.value))?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(String(globalSearch.value))?.setFilterValue(event.target.value)}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
          )}
          {searchableColumns.length > 0 &&
            searchableColumns.map(
              (column) =>
                table.getColumn(column.value ? String(column.value) : "") && (
                  <Input
                    key={String(column.value)}
                    placeholder={column.placeholder}
                    value={(table.getColumn(String(column.value))?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn(String(column.value))?.setFilterValue(event.target.value)}
                    className="w-40 lg:w-64"
                  />
                ),
            )}
          {filterableColumns.length > 0 &&
            filterableColumns.map(
              (column) =>
                table.getColumn(column.value ? String(column.value) : "") && (
                  <DataTableFacetedFilter
                    key={String(column.value)}
                    column={table.getColumn(column.value ? String(column.value) : "")}
                    title={column.label}
                    placeholder={column.placeholder}
                    options={column.options ?? []}
                  />
                ),
            )}
        </div>
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
