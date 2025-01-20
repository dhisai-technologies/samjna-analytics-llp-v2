"use server";
import { catchAsync, config, retrieve, uploadPublicFile } from "@utils/server";
import { revalidatePath } from "next/cache";
import { createInterviewQuestionSchema, updateInterviewQuestionSchema } from "./validations";

export const createInterviewQuestion = catchAsync(async (_, formData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = createInterviewQuestionSchema.safeParse({
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
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/questions/core`, {
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
  revalidatePath("/interview-questions", "page");
  return {
    success: true,
  };
});

export const updateInterviewQuestion = catchAsync(async (_, formData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = updateInterviewQuestionSchema.safeParse({
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
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/questions/core`, {
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
  revalidatePath("/interview-questions", "page");
  return {
    success: true,
  };
});

export const updateInterviewQuestionStatus = async (coreInterviewQuestionId: string, status: boolean) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/questions/core`, {
    method: "PATCH",
    body: JSON.stringify({
      coreInterviewQuestionId,
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
  revalidatePath("/interview-questions");
  return {
    success: true,
  };
};

export const deleteInterviewQuestion = async (coreInterviewQuestionId: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/interviews/questions/core`, {
    method: "DELETE",
    body: JSON.stringify({ coreInterviewQuestionId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  revalidatePath("/interview-questions", "page");
  return {
    success: true,
  };
};
