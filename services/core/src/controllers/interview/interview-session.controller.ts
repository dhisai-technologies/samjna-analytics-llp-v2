import { db } from "@/db";
import { getInterviewSessionWithSignedUrls } from "@/utils/analytics";
import { interviewParticipants, interviewSessions } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getInterviewSessions: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination, filtering } = req;
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const { interviewId } = req.query;
  if (typeof interviewId !== "string") {
    throw new AppError("Interview id is required", StatusCodes.BAD_REQUEST);
  }
  const where = and(
    getSearch([interviewSessions.id, interviewSessions.uid, interviewSessions.userId, interviewSessions.name], search),
    ...getFilters(interviewSessions, filtering),
    eq(interviewSessions.interviewId, interviewId),
    req.user.role === "ORGANIZATION" ? undefined : eq(interviewSessions.userId, req.user.id),
  );
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: interviewSessions.id,
        name: interviewSessions.name,
        key: interviewSessions.key,
        uid: interviewSessions.uid,
        createdAt: interviewSessions.createdAt,
        updatedAt: interviewSessions.updatedAt,
        userId: interviewSessions.userId,
      })
      .from(interviewSessions)
      .where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(interviewSessions, sorting) : desc(interviewSessions.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(interviewSessions)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(interviewSessions)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched interviewSessions successfully",
    data: {
      interviewSessions: result,
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const getInterviewSession: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Session id is required", StatusCodes.BAD_REQUEST);
  }
  const session = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const analytics = getInterviewSessionWithSignedUrls(session);
  return res.status(StatusCodes.OK).json({ message: "Session fetched successfully", data: { session: analytics } });
});

export const createInterviewSessionSchema = z.object({
  body: z.object({
    uid: z.string(),
    participantId: z.string(),
    interviewId: z.string(),
  }),
});

export const createInterviewSession: AppController = catchAsync(async (req, res) => {
  const { uid, interviewId, participantId } = req.body as z.infer<typeof createInterviewSessionSchema>["body"];
  const session = await db.query.interviewSessions.findFirst({ where: eq(interviewSessions.uid, uid) });
  if (session) {
    throw new AppError("Session already exists", StatusCodes.BAD_REQUEST);
  }
  const participant = await db.query.interviewParticipants.findFirst({
    where: and(eq(interviewParticipants.uid, participantId), eq(interviewParticipants.interviewId, interviewId)),
  });
  if (!participant) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  await db.insert(interviewSessions).values({
    uid,
    userId: participant.uid,
    interviewId,
  });
  // await db.update(interviewParticipants).set({ active: false }).where(eq(interviewParticipants.id, participantId));
  return res.status(StatusCodes.CREATED).json({ message: "Session created" });
});

export const updateInterviewSessionSchema = z.object({
  body: z.object({
    sessionId: z.string(),
    key: z.string().optional(),
    name: z.string().optional(),
  }),
});

export const updateInterviewSession: AppController = catchAsync(async (req, res) => {
  const { sessionId, key, name } = req.body as z.infer<typeof updateInterviewSessionSchema>["body"];
  const session = await db.query.interviewSessions.findFirst({ where: eq(interviewSessions.id, sessionId) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(interviewSessions)
    .set({
      key,
      name,
    })
    .where(eq(interviewSessions.id, sessionId));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const deleteInterviewSessionSchema = z.object({
  body: z.object({
    sessionId: z.string(),
  }),
});

export const deleteInterviewSession: AppController = catchAsync(async (req, res) => {
  const { sessionId } = req.parsed?.body as z.infer<typeof deleteInterviewSessionSchema>["body"];
  const session = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, sessionId),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(interviewSessions).where(eq(interviewSessions.id, sessionId));
  return res.status(StatusCodes.OK).json({ message: "Session deleted" });
});
