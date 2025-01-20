"use server";
import { catchAsync, config, retrieve, uploadPublicFile } from "@utils/server";
import { revalidatePath } from "next/cache";
import { createNursingQuestionSchema, updateNursingQuestionSchema } from "./validations";

export const createNursingQuestion = catchAsync(async (_, formData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = createNursingQuestionSchema.safeParse({
    ...formValues,
    options: typeof formValues.options === "string" ? JSON.parse(formValues.options) : formValues.options,
  });
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
    };
  }
  const parsed = parse.data;
  if (parsed.file && parsed.file.size > 0) {
    const uid = await uploadPublicFile(parsed.file);
    parsed.file = uid;
  } else {
    parsed.file = undefined;
  }
  const data = {
    ...parsed,
    options: parsed.options ? parsed.options : [],
  };
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/questions/core`, {
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
  revalidatePath("/nursing-questions", "page");
  return {
    success: true,
  };
});

export const updateNursingQuestion = catchAsync(async (_, formData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = updateNursingQuestionSchema.safeParse({
    ...formValues,
    options: typeof formValues.options === "string" ? JSON.parse(formValues.options) : formValues.options,
  });
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
    };
  }
  const parsed = parse.data;
  if (parsed.file && parsed.file.size > 0) {
    const uid = await uploadPublicFile(parsed.file);
    parsed.file = uid;
  } else {
    parsed.file = undefined;
  }
  const data = {
    ...parsed,
    options: parsed.options ? parsed.options : [],
  };
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/questions/core`, {
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
  revalidatePath("/nursing-questions", "page");
  return {
    success: true,
  };
});

export const updateNursingQuestionStatus = async (coreNursingQuestionId: string, status: boolean) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/questions/core`, {
    method: "PATCH",
    body: JSON.stringify({
      coreNursingQuestionId,
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
  revalidatePath("/nursing-questions");
  return {
    success: true,
  };
};

export const deleteNursingQuestion = async (coreNursingQuestionId: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/nursing/questions/core`, {
    method: "DELETE",
    body: JSON.stringify({ coreNursingQuestionId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  revalidatePath("/nursing-questions", "page");
  return {
    success: true,
  };
};
