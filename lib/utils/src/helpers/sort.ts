import { asc, desc } from "drizzle-orm";
import type { PgColumn, PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";

import type { Sort } from "../types";

export function getSort<T extends TableConfig>(table: PgTableWithColumns<T>, sorting?: Sort) {
  if (!sorting) {
    return table.id as PgColumn;
  }
  const { column: col, order } = sorting;
  const column = table[col];
  if (!column) {
    return table.id as PgColumn;
  }
  return order === "asc" ? asc(column) : desc(column);
}
