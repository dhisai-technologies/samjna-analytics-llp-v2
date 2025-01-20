"use server";

import { catchAsync, config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";

import { createUserSchema, updateUserSchema } from "./validations";

export const createUser = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = createUserSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/users`, {
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
  revalidatePath("/users");
  return {
    success: true,
  };
});

export const updateUser = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = updateUserSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/users`, {
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
  revalidatePath("/users");
  return {
    success: true,
  };
});

export const updateUserStatus = async (userId: string, status: boolean) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/users`, {
    method: "PATCH",
    body: JSON.stringify({
      userId,
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
  revalidatePath("/users");
  return {
    success: true,
  };
};
