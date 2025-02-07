"use server";
import { catchAsync, config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";
import { createStroopTestQuestionSchema, updateStroopTestQuestionSchema } from "./validations";

export const createStroopTestQuestion = catchAsync(async (_, formData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = createStroopTestQuestionSchema.safeParse({
    ...formValues,
    source: typeof formValues.source === "string" ? JSON.parse(formValues.source) : formValues.source,
    destination:
      typeof formValues.destination === "string" ? JSON.parse(formValues.destination) : formValues.destination,
  });
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
    };
  }
  const parsed = parse.data;
  const data = {
    ...parsed,
    source: {
      label: parsed.sourceLabel,
      color: parsed.sourceColor,
    },
  };
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/questions`, {
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
  revalidatePath("/stroop-test-questions", "page");
  return {
    success: true,
  };
});

export const updateStroopTestQuestion = catchAsync(async (_, formData) => {
  const formValues = Object.fromEntries(formData.entries());
  const parse = updateStroopTestQuestionSchema.safeParse({
    ...formValues,
    destination:
      typeof formValues.destination === "string" ? JSON.parse(formValues.destination) : formValues.destination,
  });
  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
    };
  }
  const parsed = parse.data;
  const data = {
    ...parsed,
    source: {
      label: parsed.sourceLabel,
      color: parsed.sourceColor,
    },
  };
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/questions`, {
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
  revalidatePath("/stroop-test-questions", "page");
  return {
    success: true,
  };
});

export const updateStroopTestQuestionStatus = async (stroopTestQuestionId: string, status: boolean) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/questions`, {
    method: "PATCH",
    body: JSON.stringify({
      stroopTestQuestionId,
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
  revalidatePath("/stroop-test-questions");
  return {
    success: true,
  };
};

export const deleteStroopTestQuestion = async (stroopTestQuestionId: string) => {
  const response = await retrieve(`${config.CORE_API_URL}/v1/stress/stroop-test/questions`, {
    method: "DELETE",
    body: JSON.stringify({ stroopTestQuestionId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  revalidatePath("/stroop-test-questions", "page");
  return {
    success: true,
  };
};
