import cors from "cors";
import express, { type Express } from "express";
import morgan from "morgan";

import { AppError, errorHandler } from "@lib/utils/errors";
import { protectApi } from "@lib/utils/middlewares";

import { config } from "@/config";
import Router from "@/routes";

export const createServer = (): Express => {
  const app = express();
  morgan.token("ist-time", () => {
    return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  });
  app
    .disable("x-powered-by")
    .use(morgan('[:ist-time] ":method :url HTTP/:http-version" :status :res[content-length]'))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(express.static("public"))
    .use(
      cors({
        origin: (origin, callback) => {
          if (!origin || config.WHITELIST.includes(origin)) {
            callback(null, true);
          } else {
            console.log("Not allowed origin: ", origin);
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      }),
    )
    .get(`/${config.NAME}/health`, (_, res) => {
      return res.json({ ok: true });
    });

  app.use(`/${config.NAME}/${config.VERSION}`, protectApi(config.API_KEY), Router);

  // Catch all 404 errors
  app.use("*", (req, _res, next) => {
    next(new AppError(`can't find the route: ${req.originalUrl} on ${config.NAME}`, 404));
  });

  // Global Error handler
  app.use(errorHandler);

  return app;
};
