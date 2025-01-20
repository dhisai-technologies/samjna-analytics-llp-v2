"use server";
import { config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

export const updateInterviewParticipantStatus = async (interviewParticipantId: string, status: boolean) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/participants`, {
    method: "PATCH",
    body: JSON.stringify({
      interviewParticipantId,
      active: status,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  revalidatePath("/[interviewId]", "page");
  return {
    success: true,
  };
};
