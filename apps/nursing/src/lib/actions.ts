"use server";

import { config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

export async function createNursingSession(uid: string, nursingTestId: string, participantId: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
      nursingTestId,
      participantId,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create session");
  }
  return {
    success: true,
  };
}

export async function deleteNursingSession(sessionId: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/sessions`, {
    method: "DELETE",
    body: JSON.stringify({
      sessionId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete session");
  }
  revalidatePath("/[nursingTestId]", "page");
  return {
    success: true,
  };
}

export async function analyzeNursingVideo(formData: FormData, analyze = true) {
  if (!analyze) {
    const response = await retrieve(`${config.CORE_API_URL}/v1/files/analytics`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload video");
    }
    return {
      success: true,
    };
  }
  const response = await fetch(`${config.NURSING_API_URL}/analyze/nursing`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to analyze video");
  }
  const json = await response.json();
  const { uid } = json.data as {
    uid: string;
  };
  return {
    uid,
  };
}

export async function uploadAnswer<TData extends Record<string, unknown>>(body: {
  uid: string;
  count: number;
  question_id: string;
  data: TData;
}) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/analytics?direct=true`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to upload data");
  }
  return {
    success: true,
  };
}

export const downloadAnalyticsFile = async (body: {
  id: string;
  count: number;
  name: "data_logs" | "speech_logs";
}) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/analytics/file/download`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? "Failed to get file");
  }
  return {
    url: json.data.url as string,
    file: json.data.file as File,
  };
};
