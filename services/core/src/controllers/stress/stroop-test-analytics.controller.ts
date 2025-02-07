import { db } from "@/db";
import { io } from "@/index";
import type { MulterBlobFile } from "@/types";
import { getStroopTestSessionWithSignedUrls, saveAnalyticsFile } from "@/utils/analytics";
import { getBlobUrl } from "@/utils/blob";
import { mailStroopTestReport } from "@/utils/report";
import { files, stroopTestSessions } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updateStroopTestAnalytics: AppController = catchAsync(async (req, res) => {
  const { direct } = req.query;
  if (direct === "true") {
    const { uid, count, question_id, data } = req.body;
    const session = await db.query.stroopTestSessions.findFirst({ where: eq(stroopTestSessions.uid, uid) });
    if (!session) {
      throw new AppError("Session not found", StatusCodes.NOT_FOUND);
    }
    await db
      .update(stroopTestSessions)
      .set({
        individualAnalytics: [
          ...(Array.isArray(session.individualAnalytics) ? session.individualAnalytics : []),
          {
            id: question_id,
            count,
            ...data,
          },
        ],
      })
      .where(eq(stroopTestSessions.uid, uid))
      .returning()
      .then((res) => res[0] ?? null);
    return res.status(StatusCodes.OK).json({ message: "Session analytics updated" });
  }

  const files = req.files as { [fieldname: string]: MulterBlobFile[] };
  const jsonData = files.json_data?.[0];
  if (!jsonData) {
    throw new AppError("JSON data file is required", StatusCodes.BAD_REQUEST);
  }
  const body = JSON.parse(jsonData.buffer.toString());
  const { uid, count, final, question_id, individual } = body;
  const session = await db.query.stroopTestSessions.findFirst({ where: eq(stroopTestSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const updated = await db
    .update(stroopTestSessions)
    .set({
      individualAnalytics: individual
        ? [
            ...(Array.isArray(session.individualAnalytics) ? session.individualAnalytics : []),
            {
              id: question_id,
              count,
              metadata: individual,
            },
          ]
        : undefined,
    })
    .where(eq(stroopTestSessions.uid, uid))
    .returning()
    .then((res) => res[0]);
  if (updated) {
    const session = getStroopTestSessionWithSignedUrls(updated);
    io.to(`stroop-test-session-${session.uid}`).emit("stroop-test-session", session);
    if (final) {
      mailStroopTestReport(session);
    }
  }
  return res.status(StatusCodes.OK).json({ message: "Session analytics updated" });
});

export const uploadStroopTestAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const file = req.file as MulterBlobFile;
  if (!file) {
    throw new AppError("No files were uploaded", StatusCodes.BAD_REQUEST);
  }
  const { uid, name, count } = req.body;
  const session = await db.query.stroopTestSessions.findFirst({ where: eq(stroopTestSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const { key } = await saveAnalyticsFile(file);
  await db
    .update(stroopTestSessions)
    .set({
      files: session.files
        ? [
            ...(Array.isArray(session.files) ? session.files : []),
            {
              key,
              name,
              count,
            },
          ]
        : [
            {
              key,
              name,
              count,
            },
          ],
    })
    .where(eq(stroopTestSessions.uid, uid));
  return res.status(StatusCodes.OK).json({
    message: "File uploaded successfully!",
  });
});

export const updateStroopTestAnalyticsLogSchema = z.object({
  body: z.object({
    uid: z.string(),
    message: z.string(),
  }),
});

export const updateStroopTestAnalyticsLog: AppController = catchAsync(async (req, res) => {
  const { uid, message } = req.body as z.infer<typeof updateStroopTestAnalyticsLogSchema>["body"];
  const session = await db.query.stroopTestSessions.findFirst({ where: eq(stroopTestSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const logs = session.logs ? [...session.logs, message] : [message];
  await db
    .update(stroopTestSessions)
    .set({
      logs,
    })
    .where(eq(stroopTestSessions.uid, uid));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const updateStroopTestAnalyticsErrorSchema = z.object({
  body: z.object({
    uid: z.string(),
    user_id: z.string(),
    error: z.any(),
  }),
});

export const updateStroopTestAnalyticsError: AppController = catchAsync(async (req, res) => {
  const { uid, error } = req.body as z.infer<typeof updateStroopTestAnalyticsErrorSchema>["body"];
  const session = await db.query.stroopTestSessions.findFirst({ where: eq(stroopTestSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const updated = await db
    .update(stroopTestSessions)
    .set({
      error,
    })
    .where(eq(stroopTestSessions.id, session.id))
    .returning()
    .then((res) => res[0]);
  io.to(`stroop-test-session-${updated?.uid}`).emit("stroop-test-session", updated);
  return res.status(StatusCodes.OK).json({ message: "Session error updated" });
});

export const downloadStroopTestAnalyticsFileSchema = z.object({
  body: z.object({
    id: z.string(),
    count: z.number(),
    name: z.enum(["data_logs", "speech_logs"]),
  }),
});

export const downloadStroopTestAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const { id, count, name } = req.body as z.infer<typeof downloadStroopTestAnalyticsFileSchema>["body"];
  const session = await db.query.stroopTestSessions.findFirst({
    where: eq(stroopTestSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  let key: string | undefined = undefined;
  const sessionFiles = session.files
    ? (session.files as Array<{ count: string; key: string; name: string }>)
    : undefined;
  if (sessionFiles) {
    key = sessionFiles.find((file) => file.name === name && file.count === count.toString())?.key;
  }
  if (!key) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  const file = await db.query.files.findFirst({
    where: eq(files.key, key),
  });
  if (!file || !file.isAnalytics) {
    throw new AppError("File not found", StatusCodes.NOT_FOUND);
  }
  const url = getBlobUrl(file.key);
  return res.status(StatusCodes.OK).json({
    message: "Fetched file successfully",
    data: { url, file },
  });
});
