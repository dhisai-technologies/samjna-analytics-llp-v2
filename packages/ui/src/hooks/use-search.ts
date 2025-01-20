import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "./use-debounce";
import { useQueryString } from "./use-query-string";

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useQueryString(searchParams);
  const search = searchParams.get("search") ?? "";
  const [searchTerm, setSearchTerm] = useState(search);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const setSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
    },
    [setSearchTerm],
  );

  useEffect(() => {
    if (debouncedSearchTerm !== search) {
      const updatedParams = {
        search: debouncedSearchTerm || null,
      };
      router.push(`${pathname}?${createQueryString(updatedParams)}`);
    }
  }, [debouncedSearchTerm, search, pathname, createQueryString, router]);

  return {
    search: searchTerm,
    setSearch,
  };
}
