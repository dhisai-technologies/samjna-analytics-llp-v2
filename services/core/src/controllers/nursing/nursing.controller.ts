import { db } from "@/db";
import { getBlobUrl } from "@/utils/blob";
import {
  coreNursingQuestions,
  nursingLevelsEnum,
  nursingParticipants,
  nursingQuestions,
  nursingTests,
} from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getNursingTests: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination, filtering } = req;
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const where = and(
    getSearch([nursingTests.id, nursingTests.title, nursingTests.description], search),
    ...getFilters(nursingTests, filtering),
    eq(nursingTests.userId, req.user.id),
  );
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx.select().from(nursingTests).where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(nursingTests, sorting) : desc(nursingTests.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(nursingTests)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched nursing tests successfully",
    data: {
      nursingTests: result,
      pageCount: getPageCount(total, pagination),
    },
  });
});

export const getNursingTest: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Nursing test id is required", StatusCodes.BAD_REQUEST);
  }
  const nursingTest = await db.query.nursingTests.findFirst({
    where: eq(nursingTests.id, id),
  });
  if (!nursingTest) {
    throw new AppError("Nursing test not found", StatusCodes.NOT_FOUND);
  }
  const coreQuestions = await db.query.coreNursingQuestions.findMany({
    where: eq(coreNursingQuestions.active, true),
    orderBy: asc(coreNursingQuestions.order),
  });
  const additionalQuestions = await db.query.nursingQuestions.findMany({
    where: and(eq(nursingQuestions.nursingTestId, id), eq(nursingQuestions.active, true)),
    orderBy: asc(coreNursingQuestions.order),
  });
  const questions = [...coreQuestions, ...additionalQuestions];
  return res.status(StatusCodes.OK).json({
    message: "Session fetched successfully",
    data: {
      nursingTest: nursingTest,
      questions: questions.map((question) =>
        question.file ? { ...question, file: getBlobUrl(question.file) } : question,
      ),
    },
  });
});

export const createNursingTestSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    startTime: z.string().transform((str) => new Date(str)),
    level: z.enum(nursingLevelsEnum.enumValues),
  }),
});

export const createNursingTest: AppController = catchAsync(async (req, res) => {
  const { title, description, startTime, level } = req.parsed?.body as z.infer<typeof createNursingTestSchema>["body"];
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const nursingTest = await db
    .insert(nursingTests)
    .values({
      title,
      description,
      startTime,
      level,
      userId: req.user.id,
    })
    .returning()
    .then((res) => res[0] ?? null);
  if (nursingTest && req.user.maxParticipants > 0) {
    for (let index = 0; index < req.user.maxParticipants; index++) {
      db.insert(nursingParticipants)
        .values({
          uid: `USR-${index + 1}`,
          nursingTestId: nursingTest.id,
        })
        .returning()
        .then((res) => res[0] ?? null);
    }
  }
  return res.status(StatusCodes.CREATED).json({
    message: "Nursing test created",
    data: {
      nursingTest,
    },
  });
});

export const updateNursingTestSchema = z.object({
  body: z.object({
    nursingTestId: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    startTime: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    level: z.enum(nursingLevelsEnum.enumValues).optional(),
  }),
});

export const updateNursingTest: AppController = catchAsync(async (req, res) => {
  const { nursingTestId, title, description, startTime, level } = req.parsed?.body as z.infer<
    typeof updateNursingTestSchema
  >["body"];
  const nursingTest = await db.query.nursingTests.findFirst({ where: eq(nursingTests.id, nursingTestId) });
  if (!nursingTest) {
    throw new AppError("Nursing test not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(nursingTests)
    .set({
      title,
      description,
      startTime,
      level,
    })
    .where(eq(nursingTests.id, nursingTestId));
  return res.status(StatusCodes.OK).json({ message: "Nursing test updated" });
});

export const deleteNursingTestSchema = z.object({
  body: z.object({
    nursingTestId: z.string(),
  }),
});

export const deleteNursingTest: AppController = catchAsync(async (req, res) => {
  const { nursingTestId } = req.parsed?.body as z.infer<typeof deleteNursingTestSchema>["body"];
  if (!nursingTestId) {
    throw new AppError("Nursing test id is required", StatusCodes.BAD_REQUEST);
  }
  const nursingTest = await db.query.nursingTests.findFirst({
    where: eq(nursingTests.id, nursingTestId),
  });
  if (!nursingTest) {
    throw new AppError("Nursing test not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(nursingTests).where(eq(nursingTests.id, nursingTestId));
  return res.status(StatusCodes.OK).json({ message: "Nursing test deleted" });
});

export const getNursingAssessmentSchema = z.object({
  body: z.object({
    nursingTestId: z.string(),
    participantId: z.string(),
  }),
});

export const getNursingAssessment: AppController = catchAsync(async (req, res) => {
  const { nursingTestId, participantId } = req.parsed?.body as z.infer<typeof getNursingAssessmentSchema>["body"];
  const nursingTest = await db.query.nursingTests.findFirst({
    where: eq(nursingTests.id, nursingTestId),
  });
  if (!nursingTest) {
    throw new AppError("Nursing test not found", StatusCodes.NOT_FOUND);
  }
  const participant = await db.query.nursingParticipants.findFirst({
    where: and(eq(nursingParticipants.uid, participantId), eq(nursingParticipants.nursingTestId, nursingTestId)),
  });
  if (!participant) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  if (!participant.active) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  const coreQuestions = await db.query.coreNursingQuestions.findMany({
    where: eq(coreNursingQuestions.active, true),
    orderBy: asc(coreNursingQuestions.order),
  });
  const additionalQuestions = await db.query.nursingQuestions.findMany({
    where: and(eq(nursingQuestions.nursingTestId, nursingTestId), eq(nursingQuestions.active, true)),
    orderBy: asc(nursingQuestions.order),
  });
  const questions = [...coreQuestions, ...additionalQuestions];
  return res.status(StatusCodes.OK).json({
    message: "Session fetched successfully",
    data: {
      nursingTest: nursingTest,
      questions: questions.map((question) =>
        question.file ? { ...question, file: getBlobUrl(question.file) } : question,
      ),
    },
  });
});

export const getNursingParticipants: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination } = req;
  const { nursingTestId } = req.query;
  if (typeof nursingTestId !== "string") {
    throw new AppError("Nursing test id is required", StatusCodes.BAD_REQUEST);
  }
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const where = and(
    getSearch([nursingParticipants.id, nursingParticipants.uid], search),
    eq(nursingParticipants.nursingTestId, nursingTestId),
  );
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx.select().from(nursingParticipants).where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(nursingParticipants, sorting) : desc(nursingParticipants.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(nursingParticipants)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched nursing test participants successfully",
    data: {
      nursingParticipants: result,
      pageCount: getPageCount(total, pagination),
    },
  });
});

export const updateNursingParticipantSchema = z.object({
  body: z.object({
    nursingParticipantId: z.string(),
    active: z.boolean().optional(),
  }),
});

export const updateNursingParticipant: AppController = catchAsync(async (req, res) => {
  const { nursingParticipantId, active } = req.parsed?.body as z.infer<typeof updateNursingParticipantSchema>["body"];
  const participant = await db.query.nursingParticipants.findFirst({
    where: eq(nursingParticipants.id, nursingParticipantId),
  });
  if (!participant) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(nursingParticipants)
    .set({
      active,
    })
    .where(eq(nursingParticipants.id, nursingParticipantId));
  return res.status(StatusCodes.OK).json({ message: "Participant updated" });
});
