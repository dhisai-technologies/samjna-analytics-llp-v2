import { asc, desc } from "drizzle-orm";
import type { PgColumn, PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";

import type { Sort } from "../types";

export function getSort<T extends TableConfig>(table: PgTableWithColumns<T>, sorting?: Sort, defaultSort?: Sort) {
  const { column: defaultColumn, order: defaultOrder } = defaultSort || { column: "id", order: "asc" };
  if (!sorting) {
    return defaultOrder === "asc" ? asc(table[defaultColumn] as PgColumn) : desc(table[defaultColumn] as PgColumn);
  }
  const { column: col, order } = sorting;
  const column = table[col];
  if (!column) {
    return defaultOrder === "asc" ? asc(table[defaultColumn] as PgColumn) : desc(table[defaultColumn] as PgColumn);
  }
  return order === "asc" ? asc(column) : desc(column);
}
