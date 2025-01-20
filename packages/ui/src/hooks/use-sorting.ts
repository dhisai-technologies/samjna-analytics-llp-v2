import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import type { SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { useQueryString } from "./use-query-string";

const schema = z.object({
  sort: z.string().optional(),
});

export function useSorting({
  defaultSort = "id:desc",
}: {
  defaultSort?: string;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);
  // Search params
  const search = schema.parse(Object.fromEntries(searchParams));
  const sort = search.sort ?? defaultSort;
  const [column, order] = sort?.split(":") ?? [];

  // Handle server-side sorting
  const [sorting, setSorting] = useState<SortingState[number]>({
    id: column ?? "",
    desc: order === "desc",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        sort: sorting?.id ? `${sorting?.id}:${sorting?.desc ? "desc" : "asc"}` : null,
      })}`,
    );
  }, [sorting]);

  return {
    sorting,
    setSorting,
  };
}
