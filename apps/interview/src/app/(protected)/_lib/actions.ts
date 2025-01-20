"use server";

import { catchAsync, config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

import { createInterviewSchema, updateInterviewSchema } from "./validations";

export const createInterview = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = createInterviewSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    return {
      error: json.message,
    };
  }
  revalidatePath("/");
  return {
    success: true,
  };
});

export const updateInterview = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = updateInterviewSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    return {
      error: json.message,
    };
  }
  revalidatePath("/");
  return {
    success: true,
  };
});

export const deleteInterview = async (interviewId: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews`, {
    method: "DELETE",
    body: JSON.stringify({ interviewId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  revalidatePath("/");
  return {
    success: true,
  };
};
