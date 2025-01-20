import "server-only";
import type { NursingTest } from "@config/nursing";
import type { SearchParams } from "@config/utils";
import { config, error, retrieve } from "@utils/server";

export async function getNursingTests(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    return error(result, response);
  }
  const { pageCount, nursingTests } = result.data as {
    nursingTests: NursingTest[];
    pageCount: number;
  };
  return {
    pageCount,
    nursingTests,
  };
}
