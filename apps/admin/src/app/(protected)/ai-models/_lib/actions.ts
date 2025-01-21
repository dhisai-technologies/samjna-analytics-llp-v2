"use server";

import { config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

export const createModel = async (formData: FormData) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/models`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to upload files");
  }
  revalidatePath("/models");
  return {
    success: true,
  };
};

export const deleteModel = async (modelId: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/models`, {
    method: "DELETE",
    body: JSON.stringify({ modelId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to model");
  }
  revalidatePath("/models");
  return {
    success: true,
  };
};
