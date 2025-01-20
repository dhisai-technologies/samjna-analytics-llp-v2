import "server-only";

import type { InterviewQuestion } from "@config/interview";
import { config, error, retrieve } from "@utils/server";

export async function getInterviewQuestions() {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/questions/core`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { coreInterviewQuestions } = result.data as {
    coreInterviewQuestions: InterviewQuestion[];
  };
  return {
    coreInterviewQuestions,
  };
}
