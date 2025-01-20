import { db } from "@/db";
import { io } from "@/index";
import type { MulterBlobFile } from "@/types";
import { getNursingSessionWithSignedUrls, saveAnalyticsFile } from "@/utils/analytics";
import { getBlobUrl } from "@/utils/blob";
import { mailNursingReport } from "@/utils/report";
import { files, nursingSessions } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updateNursingAnalytics: AppController = catchAsync(async (req, res) => {
  const { direct } = req.query;
  if (direct === "true") {
    const { uid, count, question_id, data } = req.body;
    const session = await db.query.nursingSessions.findFirst({ where: eq(nursingSessions.uid, uid) });
    if (!session) {
      throw new AppError("Session not found", StatusCodes.NOT_FOUND);
    }
    await db
      .update(nursingSessions)
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
      .where(eq(nursingSessions.uid, uid))
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
  const session = await db.query.nursingSessions.findFirst({ where: eq(nursingSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const updated = await db
    .update(nursingSessions)
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
    .where(eq(nursingSessions.uid, uid))
    .returning()
    .then((res) => res[0]);
  if (updated) {
    const session = getNursingSessionWithSignedUrls(updated);
    io.to(`nursing-session-${session.uid}`).emit("nursing-session", session);
    if (final) {
      mailNursingReport(session);
    }
  }
  return res.status(StatusCodes.OK).json({ message: "Session analytics updated" });
});

export const uploadNursingAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const file = req.file as MulterBlobFile;
  if (!file) {
    throw new AppError("No files were uploaded", StatusCodes.BAD_REQUEST);
  }
  const { uid, name, count } = req.body;
  const session = await db.query.nursingSessions.findFirst({ where: eq(nursingSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const { key } = await saveAnalyticsFile(file);
  await db
    .update(nursingSessions)
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
    .where(eq(nursingSessions.uid, uid));
  return res.status(StatusCodes.OK).json({
    message: "File uploaded successfully!",
  });
});

export const updateNursingAnalyticsLogSchema = z.object({
  body: z.object({
    uid: z.string(),
    message: z.string(),
  }),
});

export const updateNursingAnalyticsLog: AppController = catchAsync(async (req, res) => {
  const { uid, message } = req.body as z.infer<typeof updateNursingAnalyticsLogSchema>["body"];
  const session = await db.query.nursingSessions.findFirst({ where: eq(nursingSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const logs = session.logs ? [...session.logs, message] : [message];
  await db
    .update(nursingSessions)
    .set({
      logs,
    })
    .where(eq(nursingSessions.uid, uid));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const updateNursingAnalyticsErrorSchema = z.object({
  body: z.object({
    uid: z.string(),
    user_id: z.string(),
    error: z.any(),
  }),
});

export const updateNursingAnalyticsError: AppController = catchAsync(async (req, res) => {
  const { uid, error } = req.body as z.infer<typeof updateNursingAnalyticsErrorSchema>["body"];
  const session = await db.query.nursingSessions.findFirst({ where: eq(nursingSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const updated = await db
    .update(nursingSessions)
    .set({
      error,
    })
    .where(eq(nursingSessions.id, session.id))
    .returning()
    .then((res) => res[0]);
  io.to(`nursing-session-${updated?.uid}`).emit("nursing-session", updated);
  return res.status(StatusCodes.OK).json({ message: "Session error updated" });
});

export const downloadNursingAnalyticsFileSchema = z.object({
  body: z.object({
    id: z.string(),
    count: z.number(),
    name: z.enum(["data_logs", "speech_logs"]),
  }),
});

export const downloadNursingAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const { id, count, name } = req.body as z.infer<typeof downloadNursingAnalyticsFileSchema>["body"];
  const session = await db.query.nursingSessions.findFirst({
    where: eq(nursingSessions.id, id),
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
