import { db } from "@/db";
import { getStroopTestSessionWithSignedUrls } from "@/utils/analytics";
import { stroopTestSessions, users } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getStroopTestSessions: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination, filtering } = req;
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const where = and(
    getSearch(
      [stroopTestSessions.id, stroopTestSessions.uid, stroopTestSessions.userId, stroopTestSessions.name],
      search,
    ),
    ...getFilters(stroopTestSessions, filtering),
    req.user.role === "ORGANIZATION" ? undefined : eq(stroopTestSessions.userId, req.user.id),
  );
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: stroopTestSessions.id,
        name: stroopTestSessions.name,
        key: stroopTestSessions.key,
        uid: stroopTestSessions.uid,
        createdAt: stroopTestSessions.createdAt,
        updatedAt: stroopTestSessions.updatedAt,
        userId: stroopTestSessions.userId,
        users: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(stroopTestSessions)
      .innerJoin(users, eq(users.id, stroopTestSessions.userId))
      .where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(stroopTestSessions, sorting) : desc(stroopTestSessions.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(stroopTestSessions)
      .innerJoin(users, eq(users.id, stroopTestSessions.userId))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(stroopTestSessions)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched stroopTestSessions successfully",
    data: {
      stroopTestSessions: result.map((session) => ({ ...session, users: undefined, user: session.users })),
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const getStroopTestSession: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Session id is required", StatusCodes.BAD_REQUEST);
  }
  const session = await db.query.stroopTestSessions.findFirst({
    where: eq(stroopTestSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const analytics = getStroopTestSessionWithSignedUrls(session);
  return res.status(StatusCodes.OK).json({ message: "Session fetched successfully", data: { session: analytics } });
});

export const createStroopTestSessionSchema = z.object({
  body: z.object({
    uid: z.string(),
  }),
});

export const createStroopTestSession: AppController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const { uid } = req.body as z.infer<typeof createStroopTestSessionSchema>["body"];
  const session = await db.query.stroopTestSessions.findFirst({ where: eq(stroopTestSessions.uid, uid) });
  if (session) {
    throw new AppError("Session already exists", StatusCodes.BAD_REQUEST);
  }
  await db.insert(stroopTestSessions).values({
    uid,
    userId: req.user.id,
  });
  return res.status(StatusCodes.CREATED).json({ message: "Session created" });
});

export const updateStroopTestSessionSchema = z.object({
  body: z.object({
    sessionId: z.string(),
    key: z.string().optional(),
    name: z.string().optional(),
  }),
});

export const updateStroopTestSession: AppController = catchAsync(async (req, res) => {
  const { sessionId, key, name } = req.body as z.infer<typeof updateStroopTestSessionSchema>["body"];
  const session = await db.query.stroopTestSessions.findFirst({ where: eq(stroopTestSessions.id, sessionId) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(stroopTestSessions)
    .set({
      key,
      name,
    })
    .where(eq(stroopTestSessions.id, sessionId));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const deleteStroopTestSessionSchema = z.object({
  body: z.object({
    sessionId: z.string(),
  }),
});

export const deleteStroopTestSession: AppController = catchAsync(async (req, res) => {
  const { sessionId } = req.parsed?.body as z.infer<typeof deleteStroopTestSessionSchema>["body"];
  const session = await db.query.stroopTestSessions.findFirst({
    where: eq(stroopTestSessions.id, sessionId),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(stroopTestSessions).where(eq(stroopTestSessions.id, sessionId));
  return res.status(StatusCodes.OK).json({ message: "Session deleted" });
});
