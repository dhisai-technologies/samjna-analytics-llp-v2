import "server-only";
import type { NursingSession } from "@config/nursing";
import { config, error, retrieve } from "@utils/server";

export async function getNursingSession(id: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/sessions/${id}`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { session } = result.data as {
    session: NursingSession;
  };
  return {
    session,
  };
}
