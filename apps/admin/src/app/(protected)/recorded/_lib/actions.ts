"use server";

import { config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

export const deleteFile = async (id: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/files/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to delete file");
  }
  revalidatePath("/storage");
  return {
    success: true,
  };
};
