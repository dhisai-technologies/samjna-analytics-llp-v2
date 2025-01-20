import "server-only";

import { config, error, retrieve } from "@utils/server";

import type { Interview, InterviewQuestion } from "@config/interview";

export async function getInterviewAssessment(interviewId: string, participantId: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/assessment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      interviewId,
      participantId,
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { interview, questions } = result.data as {
    interview: Interview;
    questions: InterviewQuestion[];
  };
  return {
    interview,
    questions,
  };
}
