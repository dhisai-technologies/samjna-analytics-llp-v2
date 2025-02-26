"use server";
import { config, retrieve } from "@utils/server";

export async function createStressSession(uid: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create stress session");
  }
  return {
    success: true,
  };
}

export async function analyzeStressVideo(formData: FormData, analyze: boolean) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/files/analytics`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload video");
  }
  if (analyze) {
    const response = await fetch(`${config.STRESS_API_URL}/analyze/stress`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to analyze stress video");
    }
    const json = await response.json();
    const { uid } = json.data as {
      uid: string;
    };
    return {
      uid,
    };
  }
  return {
    success: true,
  };
}

export const downloadSessionAnalyticsFile = async (body: {
  id: string;
  count: number;
  name: "data_logs" | "speech_logs";
}) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/analytics/file/download`, {
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
