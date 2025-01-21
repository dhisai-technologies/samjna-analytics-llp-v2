import "server-only";

import type { StressSession } from "@config/stress";
import type { SearchParams } from "@config/utils";
import { config, error, retrieve } from "@utils/server";

export async function getStressSessions(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/sessions?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { pageCount, stressSessions } = result.data as {
    stressSessions: StressSession[];
    pageCount: number;
  };
  return {
    pageCount,
    stressSessions,
  };
}
