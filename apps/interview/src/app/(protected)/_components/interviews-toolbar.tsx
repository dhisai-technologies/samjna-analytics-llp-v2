"use client";

import { Plus, Search } from "lucide-react";
import React, { useState } from "react";

import { useAuth } from "@ui/components/providers/auth-provider";
import { FacetedFilter } from "@ui/components/registry/faceted-filter";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/ui/select";
import { useFilter } from "@ui/hooks/use-filter";
import { useSearch } from "@ui/hooks/use-search";
import { useSorting } from "@ui/hooks/use-sorting";

import { filterFields, sorters } from "../_lib/config";
import { CreateInterviewDialog } from "./create-interview-dialog";

export function InterviewsToolbar() {
  const { search, setSearch } = useSearch();
  const { sorting, setSorting } = useSorting({
    defaultSort: "startTime:desc",
  });
  const { filters, setFilters } = useFilter({
    filterFields,
  });
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2">
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by id, title or description"
            className="w-full appearance-none bg-background pl-8 shadow-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {filterFields.map((filter) => (
            <FacetedFilter key={filter.value} filters={filters} setFilters={setFilters} filter={filter} />
          ))}
        </div>
      </div>
      <Select
        onValueChange={(value) =>
          setSorting({
            id: value,
            desc: true,
          })
        }
        defaultValue={sorting.id}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select sort" />
        </SelectTrigger>
        <SelectContent>
          {sorters.map(({ value, label, icon }) => (
            <SelectItem value={value} key={value}>
              <div className="flex items-center space-x-2">
                {React.createElement(icon, {
                  className: "w-3 h-3 text-primary",
                })}
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {user?.role === "ORGANIZATION" && (
        <>
          <Button onClick={() => setOpen(true)} className="font-semibold">
            <Plus className="mr-1 size-4" aria-hidden="true" />
            Create
          </Button>
          <CreateInterviewDialog open={open} onOpenChange={setOpen} />
        </>
      )}
    </div>
  );
}
