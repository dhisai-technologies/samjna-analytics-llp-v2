import { users } from "@lib/database";
import type * as schema from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { decrypt } from "@lib/utils/helpers";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { SessionData } from "../types";

export const verifyAuthentication = (db: NodePgDatabase<typeof schema>, secretKey: string): AppController =>
  catchAsync(async (req, _res, next) => {
    let token: string | undefined = "";
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new AppError("Not authenticated to access", StatusCodes.UNAUTHORIZED);
    }
    let decoded: SessionData | null = null;
    try {
      decoded = await decrypt(token, secretKey);
    } catch (_) {
      throw new AppError("Not authenticated to access", StatusCodes.UNAUTHORIZED);
    }
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    req.user = user;
    if (!user.active) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    next();
  });
