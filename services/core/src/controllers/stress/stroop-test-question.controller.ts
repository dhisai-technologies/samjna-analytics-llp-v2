import { db } from "@/db";
import { stroopTestQuestions } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters } from "@lib/utils/helpers";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getStoopTestQuestions: AppController = catchAsync(async (req, res) => {
  const { filtering } = req;
  const result = await db
    .select()
    .from(stroopTestQuestions)
    .where(and(...getFilters(stroopTestQuestions, filtering)))
    .orderBy(desc(stroopTestQuestions.createdAt));
  return res.status(StatusCodes.OK).json({
    data: {
      stroopTestQuestions: result,
    },
  });
});

export const createStroopTestQuestionSchema = z.object({
  body: z.object({
    order: z.number(),
    title: z.string(),
    timeLimit: z.number(),
    level: z.string(),
    source: z.object({
      label: z.string(),
      color: z.string(),
    }),
    destination: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        color: z.string(),
      }),
    ),
    answer: z.string(),
  }),
});

export const createStroopTestQuestion: AppController = catchAsync(async (req, res) => {
  const { order, title, timeLimit, source, destination, answer, level } = req.parsed?.body as z.infer<
    typeof createStroopTestQuestionSchema
  >["body"];
  const question = await db
    .insert(stroopTestQuestions)
    .values({
      order,
      title,
      timeLimit,
      source,
      destination,
      answer,
      level,
    })
    .returning()
    .then((res) => res[0] ?? null);
  return res.status(StatusCodes.CREATED).json({
    message: "Stroop test question created",
    data: {
      question,
    },
  });
});

export const updateStroopTestQuestionSchema = z.object({
  body: z.object({
    stroopTestQuestionId: z.string(),
    order: z.number().optional(),
    title: z.string().optional(),
    timeLimit: z.number().optional(),
    level: z.string().optional(),
    active: z.boolean().optional(),
    source: z
      .object({
        label: z.string(),
        color: z.string(),
      })
      .optional(),
    destination: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          color: z.string(),
        }),
      )
      .optional(),
    answer: z.string().optional(),
  }),
});

export const updateStroopTestQuestion: AppController = catchAsync(async (req, res) => {
  const { stroopTestQuestionId, title, timeLimit, order, source, destination, answer, level, active } = req.parsed
    ?.body as z.infer<typeof updateStroopTestQuestionSchema>["body"];
  const question = await db.query.stroopTestQuestions.findFirst({
    where: eq(stroopTestQuestions.id, stroopTestQuestionId),
  });
  if (!question) {
    throw new AppError("Stroop test question not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(stroopTestQuestions)
    .set({
      title,
      timeLimit,
      order,
      source,
      destination,
      answer,
      level,
      active,
    })
    .where(eq(stroopTestQuestions.id, stroopTestQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Stroop test question updated" });
});

export const deleteStroopTestQuestionSchema = z.object({
  body: z.object({
    stroopTestQuestionId: z.string(),
  }),
});

export const deleteStroopTestQuestion: AppController = catchAsync(async (req, res) => {
  const { stroopTestQuestionId } = req.parsed?.body as z.infer<typeof deleteStroopTestQuestionSchema>["body"];
  if (!stroopTestQuestionId) {
    throw new AppError("Stroop test question id is required", StatusCodes.BAD_REQUEST);
  }
  const question = await db.query.stroopTestQuestions.findFirst({
    where: eq(stroopTestQuestions.id, stroopTestQuestionId),
  });
  if (!question) {
    throw new AppError("Stroop test question not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(stroopTestQuestions).where(eq(stroopTestQuestions.id, stroopTestQuestionId));
  return res.status(StatusCodes.OK).json({ message: "Stroop test question deleted" });
});
