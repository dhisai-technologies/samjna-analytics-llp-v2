import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";

export const verifyAuthorization = (validRoles?: string[], validModules?: string[]): AppController =>
  catchAsync(async (req, _res, next) => {
    if (!req.user) {
      throw new AppError("Not authenticated to access", StatusCodes.UNAUTHORIZED);
    }
    if (validModules && !validModules.includes(req.user.module)) {
      throw new AppError("Forbidden, you are not authorized to access this data", StatusCodes.FORBIDDEN);
    }
    if (validRoles && !validRoles.includes(req.user.role)) {
      throw new AppError("Forbidden, you are not authorized to access this data", StatusCodes.FORBIDDEN);
    }
    next();
  });
