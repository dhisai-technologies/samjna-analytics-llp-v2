import type { NextFunction, Request, Response } from "express";

import type { AppRequest } from "@lib/utils/types";

export function catchAsync(fn: (req: AppRequest, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as AppRequest, res, next).catch(next);
  };
}

export type AppController = ReturnType<typeof catchAsync>;
