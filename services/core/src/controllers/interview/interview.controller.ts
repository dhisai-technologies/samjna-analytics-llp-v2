import { db } from "@/db";
import { getBlobUrl } from "@/utils/blob";
import {
  coreInterviewQuestions,
  interviewLevelsEnum,
  interviewParticipants,
  interviewQuestions,
  interviews,
} from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getInterviews: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination, filtering } = req;
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const where = and(
    getSearch([interviews.id, interviews.title, interviews.description], search),
    ...getFilters(interviews, filtering),
    eq(interviews.userId, req.user.id),
  );
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx.select().from(interviews).where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(interviews, sorting) : desc(interviews.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(interviews)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched interviews successfully",
    data: {
      interviews: result,
      pageCount: getPageCount(total, pagination),
    },
  });
});

export const getInterview: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Interview id is required", StatusCodes.BAD_REQUEST);
  }
  const interview = await db.query.interviews.findFirst({
    where: eq(interviews.id, id),
  });
  if (!interview) {
    throw new AppError("Interview not found", StatusCodes.NOT_FOUND);
  }
  const coreQuestions = await db.query.coreInterviewQuestions.findMany({
    where: eq(coreInterviewQuestions.active, true),
  });
  const additionalQuestions = await db.query.interviewQuestions.findMany({
    where: and(eq(interviewQuestions.interviewId, id), eq(interviewQuestions.active, true)),
  });
  const questions = [...coreQuestions, ...additionalQuestions];
  return res.status(StatusCodes.OK).json({
    message: "Session fetched successfully",
    data: {
      interview: interview,
      questions: questions.map((question) =>
        question.file ? { ...question, file: getBlobUrl(question.file) } : question,
      ),
    },
  });
});

export const createInterviewSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    startTime: z.string().transform((str) => new Date(str)),
    level: z.enum(interviewLevelsEnum.enumValues),
  }),
});

export const createInterview: AppController = catchAsync(async (req, res) => {
  const { title, description, startTime, level } = req.parsed?.body as z.infer<typeof createInterviewSchema>["body"];
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const interview = await db
    .insert(interviews)
    .values({
      title,
      description,
      startTime,
      level,
      userId: req.user.id,
    })
    .returning()
    .then((res) => res[0] ?? null);
  if (interview && req.user.maxParticipants > 0) {
    for (let index = 0; index < req.user.maxParticipants; index++) {
      db.insert(interviewParticipants)
        .values({
          uid: `USR-${index + 1}`,
          interviewId: interview.id,
        })
        .returning()
        .then((res) => res[0] ?? null);
    }
  }
  return res.status(StatusCodes.CREATED).json({
    message: "Interview created",
    data: {
      interview,
    },
  });
});

export const updateInterviewSchema = z.object({
  body: z.object({
    interviewId: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    startTime: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    level: z.enum(interviewLevelsEnum.enumValues).optional(),
  }),
});

export const updateInterview: AppController = catchAsync(async (req, res) => {
  const { interviewId, title, description, startTime, level } = req.parsed?.body as z.infer<
    typeof updateInterviewSchema
  >["body"];
  const interview = await db.query.interviews.findFirst({ where: eq(interviews.id, interviewId) });
  if (!interview) {
    throw new AppError("Interview not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(interviews)
    .set({
      title,
      description,
      startTime,
      level,
    })
    .where(eq(interviews.id, interviewId));
  return res.status(StatusCodes.OK).json({ message: "Interview updated" });
});

export const deleteInterviewSchema = z.object({
  params: z.object({
    interviewId: z.string(),
  }),
});

export const deleteInterview: AppController = catchAsync(async (req, res) => {
  const { interviewId } = req.params as z.infer<typeof deleteInterviewSchema>["params"];
  if (!interviewId) {
    throw new AppError("Interview id is required", StatusCodes.BAD_REQUEST);
  }
  const interview = await db.query.interviews.findFirst({
    where: eq(interviews.id, interviewId),
  });
  if (!interview) {
    throw new AppError("Interview not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(interviews).where(eq(interviews.id, interviewId));
  return res.status(StatusCodes.OK).json({ message: "Interview deleted" });
});

export const getInterviewAssessmentSchema = z.object({
  body: z.object({
    interviewId: z.string(),
    participantId: z.string(),
  }),
});

export const getInterviewAssessment: AppController = catchAsync(async (req, res) => {
  const { interviewId, participantId } = req.parsed?.body as z.infer<typeof getInterviewAssessmentSchema>["body"];
  const interview = await db.query.interviews.findFirst({
    where: eq(interviews.id, interviewId),
  });
  if (!interview) {
    throw new AppError("Interview not found", StatusCodes.NOT_FOUND);
  }
  const participant = await db.query.interviewParticipants.findFirst({
    where: and(eq(interviewParticipants.uid, participantId), eq(interviewParticipants.interviewId, interviewId)),
  });
  if (!participant) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  if (!participant.active) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  const coreQuestions = await db.query.coreInterviewQuestions.findMany({
    where: eq(coreInterviewQuestions.active, true),
  });
  const additionalQuestions = await db.query.interviewQuestions.findMany({
    where: and(eq(interviewQuestions.interviewId, interviewId), eq(interviewQuestions.active, true)),
  });
  const questions = [...coreQuestions, ...additionalQuestions];
  return res.status(StatusCodes.OK).json({
    message: "Session fetched successfully",
    data: {
      interview: interview,
      questions: questions.map((question) =>
        question.file ? { ...question, file: getBlobUrl(question.file) } : question,
      ),
    },
  });
});

export const getInterviewParticipants: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination } = req;
  const { interviewId } = req.query;
  if (typeof interviewId !== "string") {
    throw new AppError("Interview id is required", StatusCodes.BAD_REQUEST);
  }
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const where = and(
    getSearch([interviewParticipants.id, interviewParticipants.uid], search),
    eq(interviewParticipants.interviewId, interviewId),
  );
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx.select().from(interviewParticipants).where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(interviewParticipants, sorting) : desc(interviewParticipants.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(interviewParticipants)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched interview participants successfully",
    data: {
      interviewParticipants: result,
      pageCount: getPageCount(total, pagination),
    },
  });
});

export const updateInterviewParticipantSchema = z.object({
  body: z.object({
    interviewParticipantId: z.string(),
    active: z.boolean().optional(),
  }),
});

export const updateInterviewParticipant: AppController = catchAsync(async (req, res) => {
  const { interviewParticipantId, active } = req.parsed?.body as z.infer<
    typeof updateInterviewParticipantSchema
  >["body"];
  const participant = await db.query.interviewParticipants.findFirst({
    where: eq(interviewParticipants.id, interviewParticipantId),
  });
  if (!participant) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(interviewParticipants)
    .set({
      active,
    })
    .where(eq(interviewParticipants.id, interviewParticipantId));
  return res.status(StatusCodes.OK).json({ message: "Participant updated" });
});
