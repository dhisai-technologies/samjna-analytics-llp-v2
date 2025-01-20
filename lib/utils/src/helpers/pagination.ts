import type { SQL } from "drizzle-orm";
import type { PgColumn, PgSelect } from "drizzle-orm/pg-core";

import type { Pagination } from "../types";

export function getWithPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  pagination?: Pagination,
) {
  if (!pagination) {
    return qb.orderBy(orderByColumn).limit(10).offset(0);
  }
  if (pagination.limit === -1) {
    return qb.orderBy(orderByColumn);
  }
  return qb.orderBy(orderByColumn).limit(pagination.limit).offset(pagination.skip);
}

export function getPageCount(total: number, pagination?: Pagination) {
  if (pagination?.limit) {
    const pageCount = Math.ceil(total / pagination.limit);
    return pageCount > 0 ? pageCount : 1;
  }
  return 1;
}
