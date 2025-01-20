import "server-only";
import type { NursingQuestion } from "@config/nursing";
import { config, error, retrieve } from "@utils/server";

export async function getNursingQuestions() {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/questions/core`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { coreNursingQuestions } = result.data as {
    coreNursingQuestions: NursingQuestion[];
  };
  return {
    coreNursingQuestions,
  };
}
