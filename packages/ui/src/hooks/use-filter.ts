"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ColumnFiltersState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import type { Option } from "@config/utils";

import { useQueryString } from "./use-query-string";

interface UseFilterProps {
  filterFields?: {
    label: string;
    value: string;
    placeholder?: string;
    options: Option[];
  }[];
}

export function useFilter({ filterFields = [] }: UseFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);

  // Memoize computation of searchableColumns and filterableColumns
  const { filterableColumns } = useMemo(() => {
    return {
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  // Initial column filters
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>((filters, [key, value]) => {
      const filterableColumn = filterableColumns.find((column) => column.value === key);

      if (filterableColumn) {
        filters.push({
          id: key,
          value: value.split("."),
        });
      }

      return filters;
    }, []);
  }, [filterableColumns, searchParams]);

  const [filters, setFilters] = useState<ColumnFiltersState>(initialColumnFilters);

  const filterableColumnFilters = filters.filter((filter) => {
    return filterableColumns.find((column) => column.value === filter.id);
  });

  const [mounted, setMounted] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Prevent resetting the page on initial render
    if (!mounted) {
      setMounted(true);
      return;
    }

    // Initialize new params
    const newParamsObject = {
      page: 1,
    };

    // Handle filterable column filters
    for (const column of filterableColumnFilters) {
      if (typeof column.value === "object" && Array.isArray(column.value)) {
        Object.assign(newParamsObject, {
          filter: `${column.id}:inArray:${column.value.join(".")}`,
        });
      }
    }

    // Remove deleted values
    for (const key of searchParams.keys()) {
      if (filterableColumns.find(() => "filter" === key) && !filterableColumnFilters.find(() => "filter" === key)) {
        Object.assign(newParamsObject, { [key]: null });
      }
    }

    // After cumulating all the changes, push new params
    router.push(`${pathname}?${createQueryString(newParamsObject)}`);
  }, [JSON.stringify(filterableColumnFilters)]);

  return {
    filters,
    setFilters,
  };
}
