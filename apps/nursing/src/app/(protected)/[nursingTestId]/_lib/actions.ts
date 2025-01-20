"use server";
import { config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

export const updateNursingParticipantStatus = async (nursingParticipantId: string, status: boolean) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/participants`, {
    method: "PATCH",
    body: JSON.stringify({
      nursingParticipantId,
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
  revalidatePath("/[nursingTestId]", "page");
  return {
    success: true,
  };
};
