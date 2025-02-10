import "server-only";
import type { StroopTestLevel, StroopTestQuestion } from "@config/stress";
import { config, error, retrieve } from "@utils/server";

export async function getStroopTestQuestions(level: StroopTestLevel) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/questions?filter=level:eq:${level}`);
  const result = await response.json();
  if (!response.ok) {
    return error(response, result);
  }
  const { stroopTestQuestions } = result.data as {
    stroopTestQuestions: StroopTestQuestion[];
  };
  return {
    stroopTestQuestions,
  };
}
