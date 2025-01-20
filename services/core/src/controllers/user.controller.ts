import { and, count, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { notifier } from "@/tools";
import { users } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { getFilters, getPageCount, getSearch, getSort, getWithPagination } from "@lib/utils/helpers";

export const getUsers: AppController = catchAsync(async (req, res) => {
  const { search, filtering, sorting, pagination } = req;
  const where = and(
    ne(users.role, "ADMIN"),
    getSearch([users.email, users.name], search),
    ...getFilters(users, filtering),
  );
  const { result, total } = await db.transaction(async (tx) => {
    const query = tx.select().from(users).where(where);
    const result = await getWithPagination(query.$dynamic(), getSort(users, sorting), pagination);
    const total = await tx
      .select({
        count: count(),
      })
      .from(users)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return {
      result,
      total,
    };
  });
  return res.status(StatusCodes.OK).json({
    message: "Fetched users",
    data: {
      users: result,
      pageCount: getPageCount(total, pagination),
    },
  });
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string(),
    maxParticipants: z.number(),
    role: z.string(),
    module: z.string(),
  }),
});

export const createUser: AppController = catchAsync(async (req, res) => {
  const { email, name, role, module, maxParticipants } = req.parsed?.body as z.infer<typeof createUserSchema>["body"];
  const existing = await db.query.users.findFirst({
    where: and(eq(users.email, email), eq(users.module, module)),
  });
  if (existing) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }
  if (role === "ADMIN") {
    throw new AppError("Cannot create ADMIN", StatusCodes.BAD_REQUEST);
  }
  const user = await db
    .insert(users)
    .values({
      name: name,
      email: email,
      role,
      module,
      maxParticipants,
    })
    .returning()
    .then((res) => res[0] ?? null);
  return res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
    data: {
      user,
    },
  });
});

export const updateUserSchema = z.object({
  body: z.object({
    userId: z.string(),
    email: z.string().optional(),
    name: z.string().optional(),
    role: z.string().optional(),
    active: z.boolean().optional(),
    maxParticipants: z.number().optional(),
  }),
});

export const updateUser: AppController = catchAsync(async (req, res) => {
  const { userId, email, name, role, active, maxParticipants } = req.parsed?.body as z.infer<
    typeof updateUserSchema
  >["body"];
  if (role === "ADMIN") {
    throw new AppError("Cannot create ADMIN role", StatusCodes.BAD_REQUEST);
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  if (email) {
    const existing = await db.query.users.findFirst({
      where: and(eq(users.email, email), eq(users.module, user.module)),
    });
    if (existing) {
      throw new AppError("User already exists", StatusCodes.CONFLICT);
    }
  }
  await db
    .update(users)
    .set({
      email,
      name,
      role,
      active,
      maxParticipants,
    })
    .where(eq(users.id, userId));
  notifier.default({
    userId: userId,
    message: "Your account details have been updated by admin",
    type: "COMMON",
  });
  return res.status(StatusCodes.OK).json({
    message: "User updated successfully",
  });
});
