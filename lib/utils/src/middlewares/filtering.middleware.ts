import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import type { FilterRule } from "@lib/utils/types";

export const parseFiltering = <T extends Record<string, unknown>>({
  validColumns,
  validRules,
}: {
  validColumns: (keyof T)[];
  validRules: FilterRule[];
}): AppController =>
  catchAsync(async (req, _res, next) => {
    const { filter } = req.query;

    if (validColumns.length === 0 || validRules.length === 0) {
      return next();
    }

    if (typeof filter !== "string") {
      return next();
    }

    const filtering = [];

    function processFilter(str: string) {
      const regex = new RegExp(`^(${validColumns.join("|")}):(${validRules.join("|")}):(.+)$`);
      const match = str.match(regex);
      if (!match) {
        throw new AppError(`Invalid filter format: ${str}`, StatusCodes.BAD_REQUEST);
      }
      const [, column, rule, value] = match;
      return {
        column: column as string,
        rule: rule as FilterRule,
        value: value as string,
      };
    }

    const filters = filter.split(",");
    for (const filter of filters) {
      const { column, rule, value } = processFilter(filter);
      filtering.push({ column, rule, value });
    }

    req.filtering = filtering;

    next();
  });
