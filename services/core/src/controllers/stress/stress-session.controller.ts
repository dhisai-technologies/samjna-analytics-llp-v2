import { db } from "@/db";
import { getSessionWithSignedUrls } from "@/utils/analytics";
import { stressSessions, users } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const getStressSessions: AppController = catchAsync(async (req, res) => {
  const { search, sorting, pagination, filtering } = req;
  const where = and(
    getSearch([stressSessions.id, stressSessions.uid, users.email, stressSessions.name], search),
    ...getFilters(stressSessions, filtering),
  );
  const { result, total, totalCount } = await db.transaction(async (tx) => {
    const query = tx
      .select({
        id: stressSessions.id,
        name: stressSessions.name,
        key: stressSessions.key,
        uid: stressSessions.uid,
        createdAt: stressSessions.createdAt,
        updatedAt: stressSessions.updatedAt,
        userId: users.id,
        users: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(stressSessions)
      .innerJoin(users, eq(users.id, stressSessions.userId))
      .where(where);
    const result = await getWithPagination(
      query.$dynamic(),
      sorting ? getSort(stressSessions, sorting) : desc(stressSessions.createdAt),
      pagination,
    );
    const total = await tx
      .select({
        count: count(),
      })
      .from(stressSessions)
      .innerJoin(users, eq(users.id, stressSessions.userId))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    const totalCount = await tx
      .select({ count: count() })
      .from(stressSessions)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
      totalCount,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched stressSessions successfully",
    data: {
      stressSessions: result.map((session) => ({ ...session, users: undefined, user: session.users })),
      pageCount: getPageCount(total, pagination),
      totalCount,
    },
  });
});

export const getStressSession: AppController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Session id is required", StatusCodes.BAD_REQUEST);
  }
  const session = await db.query.stressSessions.findFirst({
    where: eq(stressSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const analytics = await getSessionWithSignedUrls(session);
  return res.status(StatusCodes.OK).json({ message: "Session fetched successfully", data: { session: analytics } });
});

export const createStressSessionSchema = z.object({
  body: z.object({
    uid: z.string(),
  }),
});

export const createStressSession: AppController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const { uid } = req.body as z.infer<typeof createStressSessionSchema>["body"];
  const session = await db.query.stressSessions.findFirst({ where: eq(stressSessions.uid, uid) });
  if (session) {
    throw new AppError("Session already exists", StatusCodes.BAD_REQUEST);
  }
  const user = await db.query.users.findFirst({ where: eq(users.id, req.user.id) });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  await db.insert(stressSessions).values({
    uid,
    userId: user.id,
  });
  return res.status(StatusCodes.CREATED).json({ message: "Session created" });
});

export const updateStressSessionSchema = z.object({
  body: z.object({
    uid: z.string(),
    key: z.string().optional(),
    name: z.string().optional(),
    logs: z.array(z.string()).optional(),
  }),
});

export const updateStressSession: AppController = catchAsync(async (req, res) => {
  const { uid, key, logs, name } = req.body as z.infer<typeof updateStressSessionSchema>["body"];
  const session = await db.query.stressSessions.findFirst({ where: eq(stressSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db
    .update(stressSessions)
    .set({
      key,
      name,
      logs,
    })
    .where(eq(stressSessions.uid, uid));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const deleteStressSessionSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const deleteStressSession: AppController = catchAsync(async (req, res) => {
  const { id } = req.params as z.infer<typeof deleteStressSessionSchema>["params"];
  if (!id) {
    throw new AppError("Session id is required", StatusCodes.BAD_REQUEST);
  }
  const session = await db.query.stressSessions.findFirst({
    where: eq(stressSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  await db.delete(stressSessions).where(eq(stressSessions.id, id));
  return res.status(StatusCodes.OK).json({ message: "Session deleted" });
});
