import { db } from "@/db";
import { io } from "@/index";
import type { MulterBlobFile } from "@/types";
import { getSessionWithSignedUrls, saveAnalyticsFile } from "@/utils/analytics";
import { getBlobUrl } from "@/utils/blob";
import { files, stressSessions } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updateStressAnalytics: AppController = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: MulterBlobFile[] };
  const jsonData = files.json_data?.[0];
  if (!jsonData) {
    throw new AppError("JSON data file is required", StatusCodes.BAD_REQUEST);
  }
  const body = JSON.parse(jsonData.buffer.toString());
  const { uid, count, individual, combined } = body;
  const session = await db.query.stressSessions.findFirst({ where: eq(stressSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const plotFile = files.plot?.[0];
  if (plotFile) {
    const { key } = await saveAnalyticsFile(plotFile);
    if (individual) {
      individual.facial_emotion_recognition.plot = key;
    }
    if (combined) {
      combined.facial_emotion_recognition.plot = key;
    }
  }
  const updated = await db
    .update(stressSessions)
    .set({
      individualAnalytics: individual
        ? [
            ...(Array.isArray(session.individualAnalytics) ? session.individualAnalytics : []),
            {
              id: count,
              ...individual,
            },
          ]
        : undefined,
      combinedAnalytics: combined,
    })
    .where(eq(stressSessions.uid, uid))
    .returning()
    .then((res) => res[0]);
  if (updated) {
    const analytics = await getSessionWithSignedUrls(updated);
    io.to(`stress-session-${analytics.uid}`).emit("stress-session", analytics);
  }
  return res.status(StatusCodes.OK).json({ message: "Session analytics updated" });
});

export const uploadStressAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const file = req.file as MulterBlobFile;
  if (!file) {
    throw new AppError("No files were uploaded", StatusCodes.BAD_REQUEST);
  }
  const { uid, name, count } = req.body;
  const session = await db.query.stressSessions.findFirst({ where: eq(stressSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const { key } = await saveAnalyticsFile(file);
  if (!count) {
    await db
      .update(stressSessions)
      .set({
        combinedFiles: session.combinedFiles ? { ...session.combinedFiles, [name]: key } : { [name]: key },
      })
      .where(eq(stressSessions.uid, uid));
  }
  return res.status(StatusCodes.OK).json({
    message: "File uploaded successfully!",
  });
});

export const updateStressAnalyticsErrorSchema = z.object({
  body: z.object({
    uid: z.string(),
    user_id: z.string(),
    error: z.any(),
  }),
});

export const updateStressAnalyticsError: AppController = catchAsync(async (req, res) => {
  const { uid, error } = req.body as z.infer<typeof updateStressAnalyticsErrorSchema>["body"];
  const session = await db.query.stressSessions.findFirst({ where: eq(stressSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const updated = await db
    .update(stressSessions)
    .set({
      error,
    })
    .where(eq(stressSessions.id, session.id))
    .returning()
    .then((res) => res[0]);
  io.to(`stress-session-${updated?.uid}`).emit("stress-session", updated);
  return res.status(StatusCodes.OK).json({ message: "Session error updated" });
});

export const downloadStressAnalyticsFileSchema = z.object({
  body: z.object({
    id: z.string(),
    count: z.number(),
    name: z.enum(["data_logs", "speech_logs"]),
  }),
});

export const downloadStressAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const { id, count, name } = req.body as z.infer<typeof downloadStressAnalyticsFileSchema>["body"];
  const session = await db.query.stressSessions.findFirst({
    where: eq(stressSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  let key: string | undefined = undefined;
  if (count === 0) {
    key = session.combinedFiles ? (session.combinedFiles as Record<string, string>)[name] : undefined;
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
