import "server-only";

import type { File } from "@config/core";
import type { SearchParams } from "@config/utils";
import { config, error, retrieve } from "@utils/server";

export async function getFiles(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(
    `${config.CORE_API_URL}/v1/files/analytics?${queryParams.length > 0 ? queryParams : "sort=updatedAt:desc"}`,
  );
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { pageCount, files, totalCount } = result.data as {
    files: File[];
    pageCount: number;
    totalCount: number;
  };
  return {
    pageCount,
    files,
    totalCount,
  };
}
