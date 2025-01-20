import { db } from "@/db";
import { getNursingSessionWithSignedUrls } from "@/utils/analytics";
import { nursingParticipants, nursingSessions } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getNursingSessions: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination, filtering } = req;
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const { nursingTestId } = req.query;
  if (typeof nursingTestId !== "string") {
    throw new AppError("Nursing id is required", StatusCodes.BAD_REQUEST);
  }
  const where = and(
    getSearch([nursingSessions.id, nursingSessions.uid, nursingSessions.userId, nursingSessions.name], search),
    ...getFilters(nursingSessions, filtering),
    eq(nursingSessions.nursingTestId, nursingTestId),
    req.user.role === "ORGANIZATION" ? undefined : eq(nursingSessions.userId, req.user.id),
  );
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: nursingSessions.id,
        name: nursingSessions.name,
        key: nursingSessions.key,
        uid: nursingSessions.uid,
        createdAt: nursingSessions.createdAt,
        updatedAt: nursingSessions.updatedAt,
        userId: nursingSessions.userId,
      })
      .from(nursingSessions)
      .where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(nursingSessions, sorting) : desc(nursingSessions.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(nursingSessions)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(nursingSessions)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched nursingSessions successfully",
    data: {
      nursingSessions: result,
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const getNursingSession: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Session id is required", StatusCodes.BAD_REQUEST);
  }
  const session = await db.query.nursingSessions.findFirst({
    where: eq(nursingSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const analytics = getNursingSessionWithSignedUrls(session);
  return res.status(StatusCodes.OK).json({ message: "Session fetched successfully", data: { session: analytics } });
});

export const createNursingSessionSchema = z.object({
  body: z.object({
    uid: z.string(),
    participantId: z.string(),
    nursingTestId: z.string(),
  }),
});

export const createNursingSession: AppController = catchAsync(async (req, res) => {
  const { uid, nursingTestId, participantId } = req.body as z.infer<typeof createNursingSessionSchema>["body"];
  const session = await db.query.nursingSessions.findFirst({ where: eq(nursingSessions.uid, uid) });
  if (session) {
    throw new AppError("Session already exists", StatusCodes.BAD_REQUEST);
  }
  const participant = await db.query.nursingParticipants.findFirst({
    where: and(eq(nursingParticipants.uid, participantId), eq(nursingParticipants.nursingTestId, nursingTestId)),
  });
  if (!participant) {
    throw new AppError("Participant not found", StatusCodes.NOT_FOUND);
  }
  await db.insert(nursingSessions).values({
    uid,
    userId: participant.uid,
    nursingTestId,
  });
  // await db.update(nursingParticipants).set({ active: false }).where(eq(nursingParticipants.id, participantId));
  return res.status(StatusCodes.CREATED).json({ message: "Session created" });
});

export const updateNursingSessionSchema = z.object({
  body: z.object({
    sessionId: z.string(),
    key: z.string().optional(),
    name: z.string().optional(),
  }),
});

export const updateNursingSession: AppController = catchAsync(async (req, res) => {
  const { sessionId, key, name } = req.body as z.infer<typeof updateNursingSessionSchema>["body"];
  const session = await db.query.nursingSessions.findFirst({ where: eq(nursingSessions.id, sessionId) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(nursingSessions)
    .set({
      key,
      name,
    })
    .where(eq(nursingSessions.id, sessionId));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const deleteNursingSessionSchema = z.object({
  body: z.object({
    sessionId: z.string(),
  }),
});

export const deleteNursingSession: AppController = catchAsync(async (req, res) => {
  const { sessionId } = req.parsed?.body as z.infer<typeof deleteNursingSessionSchema>["body"];
  const session = await db.query.nursingSessions.findFirst({
    where: eq(nursingSessions.id, sessionId),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(nursingSessions).where(eq(nursingSessions.id, sessionId));
  return res.status(StatusCodes.OK).json({ message: "Session deleted" });
});
