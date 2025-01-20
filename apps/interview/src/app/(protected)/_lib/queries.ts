import "server-only";
import type { Interview } from "@config/interview";
import type { SearchParams } from "@config/utils";
import { config, error, retrieve } from "@utils/server";

export async function getInterviews(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    return error(result, response);
  }
  const { pageCount, interviews } = result.data as {
    interviews: Interview[];
    pageCount: number;
  };
  return {
    pageCount,
    interviews,
  };
}
