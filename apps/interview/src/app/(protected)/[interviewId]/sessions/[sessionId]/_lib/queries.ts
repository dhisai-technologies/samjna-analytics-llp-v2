import "server-only";

import type { InterviewSession } from "@config/interview";
import { config, error, retrieve } from "@utils/server";

export async function getInterviewSession(id: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/sessions/${id}`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { session } = result.data as {
    session: InterviewSession;
  };
  return {
    session,
  };
}
