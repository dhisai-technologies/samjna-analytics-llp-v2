import { type SQL, between, eq, ilike, inArray, isNull, notIlike, or } from "drizzle-orm";
import type { PgColumn, PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";

import type { Filter } from "@lib/utils/types";

export function getFilters<T extends TableConfig>(table: PgTableWithColumns<T>, filtering?: Filter[]) {
  const filters = [] as SQL[];
  if (!filtering) return filters;
  for (const { column: col, rule, value } of filtering) {
    const column = table[col];
    if (!column) {
      continue;
    }
    switch (rule) {
      case "eq":
        filters.push(eq(column, value));
        break;
      case "between": {
        const values = value.split(".").filter(Boolean);
        if (values.length === 2) {
          filters.push(between(column, new Date(values[0] || new Date()), new Date(values[1] || new Date())));
        }
        break;
      }
      case "isNull":
        filters.push(isNull(column));
        break;
      case "ilike":
        filters.push(ilike(column, `%${value}%`));
        break;
      case "notILike":
        filters.push(notIlike(column, `%${value}%`));
        break;
      case "inArray":
        filters.push(inArray(column, value?.split(".").filter(Boolean) ?? []));
    }
  }
  return filters;
}

export function getSearch(columns: PgColumn[], value?: string) {
  const filters = [] as SQL[];
  if (!value) return or(...filters);
  for (const column of columns) {
    filters.push(ilike(column, `%${value}%`));
  }
  return or(...filters);
}
