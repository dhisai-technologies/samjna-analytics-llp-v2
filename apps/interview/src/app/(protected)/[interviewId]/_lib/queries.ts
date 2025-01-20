import "server-only";

import { config, error, retrieve } from "@utils/server";

import type { Interview, InterviewParticipant, InterviewQuestion, InterviewSession } from "@config/interview";
import type { SearchParams } from "@config/utils";

export async function getInterview(id: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/${id}`);
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

export async function getInterviewParticipants(interviewId: string, searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>);
  queryParams.delete("tab");
  const response = await retrieve(
    `${config.CORE_API_URL}/v1/interviews/participants?${queryParams.toString()}&interviewId=${interviewId}`,
  );
  const result = await response.json();
  if (!response.ok) {
    return error(result, response);
  }
  const { pageCount, interviewParticipants } = result.data as {
    interviewParticipants: InterviewParticipant[];
    pageCount: number;
  };
  return {
    pageCount,
    interviewParticipants,
  };
}

export async function getInterviewSessions(interviewId: string, searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>);
  queryParams.delete("tab");
  const response = await retrieve(
    `${config.CORE_API_URL}/v1/interviews/sessions?${queryParams.toString()}&interviewId=${interviewId}`,
  );
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { interviewSessions, pageCount } = result.data as {
    interviewSessions: InterviewSession[];
    pageCount: number;
  };
  return {
    interviewSessions,
    pageCount,
  };
}
