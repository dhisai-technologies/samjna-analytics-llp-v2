import "server-only";

import type { NursingQuestion, NursingTest } from "@config/nursing";
import { config, error, retrieve } from "@utils/server";

export async function getNursingAssessment(nursingTestId: string, participantId: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/assessment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nursingTestId,
      participantId,
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { nursingTest, questions } = result.data as {
    nursingTest: NursingTest;
    questions: NursingQuestion[];
  };
  return {
    nursingTest,
    questions,
  };
}
