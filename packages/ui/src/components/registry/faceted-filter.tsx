import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import type { ColumnFiltersState } from "@tanstack/react-table";
import type React from "react";

import type { Option } from "@config/utils";
import { cn } from "@ui/utils";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

interface FacetedFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: ColumnFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  filter: {
    label: string;
    value: string;
    placeholder?: string;
    options: Option[];
  };
}

export function FacetedFilter({ filters, setFilters, filter }: FacetedFiltersProps) {
  const [selectedValues, setSelectedValues] = useState(new Set<string>());
  useEffect(() => {
    const existing = filters.find((f) => f.id === filter.value);
    const initialValues = new Set<string>();
    if (existing && Array.isArray(existing.value)) {
      for (const value of existing.value) {
        initialValues.add(value);
      }
      setSelectedValues(initialValues);
    }
    if (!existing) {
      setSelectedValues(new Set<string>());
    }
  }, [filters, filter]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed">
          <PlusCircledIcon className="mr-2 size-4" />
          {filter.label}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  filter.options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder={filter.placeholder || filter.label} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filter.options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      if (filterValues.length > 0) {
                        setFilters((previous) => {
                          let prev = previous;
                          const existing = prev.find((f) => f.id === filter.value);
                          if (existing) {
                            prev = previous.filter((f) => f.id !== existing.id);
                          }
                          return [
                            ...prev,
                            {
                              id: filter.value,
                              value: filterValues,
                            },
                          ];
                        });
                      } else {
                        setFilters((previous) => {
                          let prev = previous;
                          const existing = prev.find((f) => f.id === filter.value);
                          if (existing) {
                            prev = previous.filter((f) => f.id !== existing.id);
                          }
                          return prev;
                        });
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </div>
                    {option.icon && <option.icon className="mr-2 size-4 text-muted-foreground" aria-hidden="true" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() =>
                      setFilters((previous) => {
                        let prev = previous;
                        const existing = prev.find((f) => f.id === filter.value);
                        if (existing) {
                          prev = previous.filter((f) => f.id !== existing.id);
                        }
                        return prev;
                      })
                    }
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
