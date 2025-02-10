import "server-only";

import type { StroopTestSession } from "@config/stress";
import type { SearchParams } from "@config/utils";
import { config, error, retrieve } from "@utils/server";

export async function getStroopSessions(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/sessions?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { pageCount, stroopTestSessions } = result.data as {
    stroopTestSessions: StroopTestSession[];
    pageCount: number;
  };
  return {
    pageCount,
    stroopTestSessions,
  };
}
