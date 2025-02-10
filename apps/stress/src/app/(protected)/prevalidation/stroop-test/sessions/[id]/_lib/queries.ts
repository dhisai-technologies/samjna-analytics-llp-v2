import "server-only";
import type { StroopTestSession } from "@config/stress";
import { config, error, retrieve } from "@utils/server";

export async function getStroopSession(id: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/sessions/${id}`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { session } = result.data as {
    session: StroopTestSession;
  };
  return {
    session,
  };
}
