import "server-only";

import { config, error, retrieve } from "@utils/server";

import type { NursingParticipant, NursingQuestion, NursingSession, NursingTest } from "@config/nursing";
import type { SearchParams } from "@config/utils";

export async function getNursingTest(id: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/${id}`);
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

export async function getNursingParticipants(nursingTestId: string, searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>);
  queryParams.delete("tab");
  const response = await retrieve(
    `${config.CORE_API_URL}/v1/nursing/participants?${queryParams.toString()}&nursingTestId=${nursingTestId}`,
  );
  const result = await response.json();
  if (!response.ok) {
    return error(result, response);
  }
  const { pageCount, nursingParticipants } = result.data as {
    nursingParticipants: NursingParticipant[];
    pageCount: number;
  };
  return {
    pageCount,
    nursingParticipants,
  };
}

export async function getNursingSessions(nursingTestId: string, searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>);
  queryParams.delete("tab");
  const response = await retrieve(
    `${config.CORE_API_URL}/v1/nursing/sessions?${queryParams.toString()}&nursingTestId=${nursingTestId}`,
  );
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { nursingSessions, pageCount } = result.data as {
    nursingSessions: NursingSession[];
    pageCount: number;
  };
  return {
    nursingSessions,
    pageCount,
  };
}
