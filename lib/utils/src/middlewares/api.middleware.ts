import { type AppController, AppError, catchAsync } from "@lib/utils/errors";

export const protectApi = (apiKey: string): AppController =>
  catchAsync(async (req, _res, next) => {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (!req.headers.hasOwnProperty("x-api-key")) {
      throw new AppError("Not Authorized to access API", 401);
    }
    if (req.headers["x-api-key"] !== apiKey) {
      throw new AppError("Not Authorized to access API", 401);
    }
    const { search } = req.query;
    if (typeof search === "string") {
      req.search = search;
    }
    next();
  });
