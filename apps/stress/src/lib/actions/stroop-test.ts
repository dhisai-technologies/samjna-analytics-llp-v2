"use server";

import { config, retrieve } from "@utils/server";

export async function createStroopTestSession(uid: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/sessions`, {
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

export async function analyzeStroopTestVideo(formData: FormData, analyze: boolean) {
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

export async function uploadStroopTestAnswer<TData extends Record<string, unknown>>(body: {
  uid: string;
  count: number;
  question_id: string;
  data: TData;
}) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/analytics?direct=true`, {
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
