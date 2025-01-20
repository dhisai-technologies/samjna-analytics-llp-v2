import { db } from "@/db";
import { getBlobUrl } from "@/utils/blob";
import { coreInterviewQuestions, interviewQuestionTypesEnum, interviewQuestions, interviews } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getCoreInterviewQuestions: AppController = catchAsync(async (_req, res) => {
  const result = await db.select().from(coreInterviewQuestions).execute();
  return res.status(StatusCodes.OK).json({
    data: {
      coreInterviewQuestions: result.map((question) =>
        question.file ? { ...question, file: getBlobUrl(question.file) } : question,
      ),
    },
  });
});

export const createCoreInterviewQuestionSchema = z.object({
  body: z.object({
    order: z.number(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.enum(interviewQuestionTypesEnum.enumValues),
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

export const createCoreInterviewQuestion: AppController = catchAsync(async (req, res) => {
  const { order, title, description, category, type, file, timeLimit, options, recordVideo } = req.parsed
    ?.body as z.infer<typeof createCoreInterviewQuestionSchema>["body"];
  const question = await db
    .insert(coreInterviewQuestions)
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
    message: "Interview question created",
    data: {
      question,
    },
  });
});

export const updateCoreInterviewQuestionSchema = z.object({
  body: z.object({
    coreInterviewQuestionId: z.string(),
    title: z.string().optional(),
    type: z.enum(interviewQuestionTypesEnum.enumValues).optional(),
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

export const updateCoreInterviewQuestion: AppController = catchAsync(async (req, res) => {
  const {
    coreInterviewQuestionId,
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
  } = req.parsed?.body as z.infer<typeof updateCoreInterviewQuestionSchema>["body"];
  const question = await db.query.coreInterviewQuestions.findFirst({
    where: eq(coreInterviewQuestions.id, coreInterviewQuestionId),
  });
  if (!question) {
    throw new AppError("Interview question not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(coreInterviewQuestions)
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
    .where(eq(coreInterviewQuestions.id, coreInterviewQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Interview question updated" });
});

export const deleteCoreInterviewQuestionSchema = z.object({
  body: z.object({
    coreInterviewQuestionId: z.string(),
  }),
});

export const deleteCoreInterviewQuestion: AppController = catchAsync(async (req, res) => {
  const { coreInterviewQuestionId } = req.parsed?.body as z.infer<typeof deleteCoreInterviewQuestionSchema>["body"];
  if (!coreInterviewQuestionId) {
    throw new AppError("Interview question id is required", StatusCodes.BAD_REQUEST);
  }
  const question = await db.query.coreInterviewQuestions.findFirst({
    where: eq(coreInterviewQuestions.id, coreInterviewQuestionId),
  });
  if (!question) {
    throw new AppError("Interview question not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(coreInterviewQuestions).where(eq(coreInterviewQuestions.id, coreInterviewQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Interview question deleted" });
});

export const createInterviewQuestionSchema = z.object({
  body: z.object({
    interviewId: z.string(),
    order: z.number(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.enum(interviewQuestionTypesEnum.enumValues),
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

export const createInterviewQuestion: AppController = catchAsync(async (req, res) => {
  const { interviewId, order, title, description, category, type, file, timeLimit, options, recordVideo } = req.parsed
    ?.body as z.infer<typeof createInterviewQuestionSchema>["body"];
  const interview = await db.query.interviews.findFirst({ where: eq(interviews.id, interviewId) });
  if (!interview) {
    throw new AppError("Interview not found", StatusCodes.NOT_FOUND);
  }
  const question = await db
    .insert(interviewQuestions)
    .values({
      interviewId,
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
    message: "Interview question created",
    data: {
      question,
    },
  });
});

export const updateInterviewQuestionSchema = z.object({
  body: z.object({
    interviewQuestionId: z.string(),
    title: z.string().optional(),
    type: z.enum(interviewQuestionTypesEnum.enumValues).optional(),
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

export const updateInterviewQuestion: AppController = catchAsync(async (req, res) => {
  const {
    interviewQuestionId,
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
  } = req.parsed?.body as z.infer<typeof updateInterviewQuestionSchema>["body"];
  const question = await db.query.interviewQuestions.findFirst({
    where: eq(interviewQuestions.id, interviewQuestionId),
  });
  if (!question) {
    throw new AppError("Interview question not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(interviewQuestions)
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
    .where(eq(interviewQuestions.id, interviewQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Interview question updated" });
});

export const deleteInterviewQuestionSchema = z.object({
  body: z.object({
    interviewQuestionId: z.string(),
  }),
});

export const deleteInterviewQuestion: AppController = catchAsync(async (req, res) => {
  const { interviewQuestionId } = req.parsed?.body as z.infer<typeof deleteInterviewQuestionSchema>["body"];
  if (!interviewQuestionId) {
    throw new AppError("Interview question id is required", StatusCodes.BAD_REQUEST);
  }
  const question = await db.query.interviewQuestions.findFirst({
    where: eq(interviewQuestions.id, interviewQuestionId),
  });
  if (!question) {
    throw new AppError("Interview question not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(interviewQuestions).where(eq(interviewQuestions.id, interviewQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Interview question deleted" });
});
