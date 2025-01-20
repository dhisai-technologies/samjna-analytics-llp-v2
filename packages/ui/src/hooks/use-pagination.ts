import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import type { PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { useQueryString } from "./use-query-string";

const schema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().optional(),
});

export function usePagination({
  defaultPerPage = 10,
}: {
  defaultPerPage?: number;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);
  // Search params
  const search = schema.parse(Object.fromEntries(searchParams));
  const page = search.page;
  const limit = search.limit ?? defaultPerPage;
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize,
      })}`,
      {
        scroll: false,
      },
    );
  }, [pageIndex, pageSize]);

  return {
    pagination,
    setPagination,
  };
}
