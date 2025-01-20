"use server";
import { catchAsync, config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import type { Module } from "@config/core";
import { redirect } from "next/navigation";
import { requestUserOtpSchema, verifyUserOtpSchema } from "./validations";

export const requestUserOtp = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = requestUserOtpSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/auth/request-otp`, {
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
  return {
    success: true,
  };
});

export const resendUserOtp = async (data: {
  email: string;
  module: Module;
}) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/auth/request-otp`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  return {
    success: true,
  };
};

export const verifyUserOtp = catchAsync(async (_, formData: FormData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = verifyUserOtpSchema.safeParse(formValues);
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: undefined,
    };
  }
  const data = parse.data;
  const response = await retrieve(`${config.CORE_API_URL}/v1/auth/verify-otp`, {
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
  const result = json.data as {
    session: string;
  };
  const cookie = cookies();
  cookie.set("session", result.session, {
    path: "/",
    httpOnly: true,
  });
  revalidatePath("/", "layout");
  redirect("/");
});
