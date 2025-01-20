import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";

export const parseSorting = <T extends Record<string, unknown>>({
  validColumns,
}: {
  validColumns: (keyof T)[];
}): AppController =>
  catchAsync(async (req, _res, next) => {
    const { sort } = req.query;

    if (validColumns.length === 0) {
      return next();
    }

    if (typeof sort !== "string") {
      return next();
    }

    const regex = new RegExp(`^(${validColumns.join("|")}):(desc|asc)$`);
    const match = sort.match(regex);
    if (!match) {
      throw new AppError(`Invalid sort format: ${sort}`, StatusCodes.BAD_REQUEST);
    }
    const [, column, order] = match;

    req.sorting = {
      column: column as string,
      order: order as "asc" | "desc",
    };

    next();
  });
