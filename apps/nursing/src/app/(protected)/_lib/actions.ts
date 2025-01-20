"use server";

import { catchAsync, config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

import { createNursingTestSchema, updateNursingTestSchema } from "./validations";

export const createNursingTest = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = createNursingTestSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing`, {
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

export const updateNursingTest = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = updateNursingTestSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing`, {
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

export const deleteNursingTest = async (nursingTestId: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing`, {
    method: "DELETE",
    body: JSON.stringify({ nursingTestId }),
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
