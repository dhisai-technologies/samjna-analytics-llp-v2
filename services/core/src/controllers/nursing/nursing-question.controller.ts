import { db } from "@/db";
import { getBlobUrl } from "@/utils/blob";
import { coreNursingQuestions, nursingQuestionTypesEnum, nursingQuestions, nursingTests } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getCoreNursingQuestions: AppController = catchAsync(async (_req, res) => {
  const result = await db.select().from(coreNursingQuestions).execute();
  return res.status(StatusCodes.OK).json({
    data: {
      coreNursingQuestions: result.map((question) =>
        question.file ? { ...question, file: getBlobUrl(question.file) } : question,
      ),
    },
  });
});

export const createCoreNursingQuestionSchema = z.object({
  body: z.object({
    order: z.number(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.enum(nursingQuestionTypesEnum.enumValues),
    file: z.string().optional(),
    timeLimit: z.number().optional(),
    recordVideo: z.boolean().optional(),
    options: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});

export const createCoreNursingQuestion: AppController = catchAsync(async (req, res) => {
  const { order, title, description, category, type, file, timeLimit, options, recordVideo } = req.parsed
    ?.body as z.infer<typeof createCoreNursingQuestionSchema>["body"];
  const question = await db
    .insert(coreNursingQuestions)
    .values({
      order,
      title,
      description,
      category,
      type,
      file,
      timeLimit,
      options,
      recordVideo,
    })
    .returning()
    .then((res) => res[0] ?? null);
  return res.status(StatusCodes.CREATED).json({
    message: "Nursing question created",
    data: {
      question,
    },
  });
});

export const updateCoreNursingQuestionSchema = z.object({
  body: z.object({
    coreNursingQuestionId: z.string(),
    title: z.string().optional(),
    type: z.enum(nursingQuestionTypesEnum.enumValues).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    file: z.string().optional(),
    timeLimit: z.number().optional(),
    order: z.number().optional(),
    active: z.boolean().optional(),
    recordVideo: z.boolean().optional(),
    options: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});

export const updateCoreNursingQuestion: AppController = catchAsync(async (req, res) => {
  const {
    coreNursingQuestionId,
    title,
    description,
    category,
    file,
    active,
    timeLimit,
    order,
    options,
    type,
    recordVideo,
  } = req.parsed?.body as z.infer<typeof updateCoreNursingQuestionSchema>["body"];
  const question = await db.query.coreNursingQuestions.findFirst({
    where: eq(coreNursingQuestions.id, coreNursingQuestionId),
  });
  if (!question) {
    throw new AppError("Nursing question not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(coreNursingQuestions)
    .set({
      title,
      type,
      description,
      category,
      file,
      active,
      timeLimit,
      order,
      options,
      recordVideo,
    })
    .where(eq(coreNursingQuestions.id, coreNursingQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Nursing question updated" });
});

export const deleteCoreNursingQuestionSchema = z.object({
  body: z.object({
    coreNursingQuestionId: z.string(),
  }),
});

export const deleteCoreNursingQuestion: AppController = catchAsync(async (req, res) => {
  const { coreNursingQuestionId } = req.parsed?.body as z.infer<typeof deleteCoreNursingQuestionSchema>["body"];
  if (!coreNursingQuestionId) {
    throw new AppError("Nursing question id is required", StatusCodes.BAD_REQUEST);
  }
  const question = await db.query.coreNursingQuestions.findFirst({
    where: eq(coreNursingQuestions.id, coreNursingQuestionId),
  });
  if (!question) {
    throw new AppError("Nursing question not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(coreNursingQuestions).where(eq(coreNursingQuestions.id, coreNursingQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Nursing question deleted" });
});

export const createNursingQuestionSchema = z.object({
  body: z.object({
    nursingTestId: z.string(),
    order: z.number(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.enum(nursingQuestionTypesEnum.enumValues),
    file: z.string().optional(),
    timeLimit: z.number().optional(),
    recordVideo: z.boolean().optional(),
    options: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});

export const createNursingQuestion: AppController = catchAsync(async (req, res) => {
  const { nursingTestId, order, title, description, category, type, file, timeLimit, options, recordVideo } = req.parsed
    ?.body as z.infer<typeof createNursingQuestionSchema>["body"];
  const nursingTest = await db.query.nursingTests.findFirst({ where: eq(nursingTests.id, nursingTestId) });
  if (!nursingTest) {
    throw new AppError("Nursing not found", StatusCodes.NOT_FOUND);
  }
  const question = await db
    .insert(nursingQuestions)
    .values({
      nursingTestId,
      order,
      title,
      description,
      category,
      type,
      file,
      options,
      timeLimit,
      recordVideo,
    })
    .returning()
    .then((res) => res[0] ?? null);
  return res.status(StatusCodes.CREATED).json({
    message: "Nursing question created",
    data: {
      question,
    },
  });
});

export const updateNursingQuestionSchema = z.object({
  body: z.object({
    nursingQuestionId: z.string(),
    title: z.string().optional(),
    type: z.enum(nursingQuestionTypesEnum.enumValues).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    file: z.string().optional(),
    timeLimit: z.number().optional(),
    order: z.number().optional(),
    active: z.boolean().optional(),
    recordVideo: z.boolean().optional(),
    options: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});

export const updateNursingQuestion: AppController = catchAsync(async (req, res) => {
  const {
    nursingQuestionId,
    title,
    description,
    category,
    file,
    timeLimit,
    order,
    options,
    type,
    active,
    recordVideo,
  } = req.parsed?.body as z.infer<typeof updateNursingQuestionSchema>["body"];
  const question = await db.query.nursingQuestions.findFirst({
    where: eq(nursingQuestions.id, nursingQuestionId),
  });
  if (!question) {
    throw new AppError("Nursing question not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(nursingQuestions)
    .set({
      title,
      type,
      description,
      category,
      file,
      active,
      timeLimit,
      order,
      options,
      recordVideo,
    })
    .where(eq(nursingQuestions.id, nursingQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Nursing question updated" });
});

export const deleteNursingQuestionSchema = z.object({
  body: z.object({
    nursingQuestionId: z.string(),
  }),
});

export const deleteNursingQuestion: AppController = catchAsync(async (req, res) => {
  const { nursingQuestionId } = req.parsed?.body as z.infer<typeof deleteNursingQuestionSchema>["body"];
  if (!nursingQuestionId) {
    throw new AppError("Nursing question id is required", StatusCodes.BAD_REQUEST);
  }
  const question = await db.query.nursingQuestions.findFirst({
    where: eq(nursingQuestions.id, nursingQuestionId),
  });
  if (!question) {
    throw new AppError("Nursing question not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(nursingQuestions).where(eq(nursingQuestions.id, nursingQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Nursing question deleted" });
});
