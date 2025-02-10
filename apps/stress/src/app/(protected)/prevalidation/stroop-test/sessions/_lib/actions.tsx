"use server";

import { config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

export const deleteStroopSession = async (sessionId: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/sessions`, {
    method: "DELETE",
    body: JSON.stringify({ sessionId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to delete session");
  }
  revalidatePath("/prevalidation/stroop-test/sessions");
  return {
    success: true,
  };
};
