import { db } from "@/db";
import { io } from "@/index";
import type { MulterBlobFile } from "@/types";
import { getInterviewSessionWithSignedUrls, saveAnalyticsFile } from "@/utils/analytics";
import { getBlobUrl } from "@/utils/blob";
import { files, interviewSessions } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updateInterviewAnalytics: AppController = catchAsync(async (req, res) => {
  const { direct } = req.query;

  if (direct === "true") {
    const { uid, count, data } = req.body;
    const session = await db.query.interviewSessions.findFirst({ where: eq(interviewSessions.uid, uid) });
    if (!session) {
      throw new AppError("Session not found", StatusCodes.NOT_FOUND);
    }
    await db
      .update(interviewSessions)
      .set({
        individualAnalytics: [
          ...(Array.isArray(session.individualAnalytics) ? session.individualAnalytics : []),
          {
            id: count,
            ...data,
          },
        ],
      })
      .where(eq(interviewSessions.uid, uid));
    return res.status(StatusCodes.OK).json({ message: "Session analytics updated" });
  }

  const files = req.files as { [fieldname: string]: MulterBlobFile[] };
  const jsonData = files.json_data?.[0];
  if (!jsonData) {
    throw new AppError("JSON data file is required", StatusCodes.BAD_REQUEST);
  }
  const body = JSON.parse(jsonData.buffer.toString());
  const { uid, count, question_id, individual, combined } = body;
  const session = await db.query.interviewSessions.findFirst({ where: eq(interviewSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const valencePlotFile = files.valence_plot?.[0];
  const ratioPlotFile = files.ratio_plot?.[0];
  const wordCloudFile = files.word_cloud?.[0];
  if (valencePlotFile) {
    const { key } = await saveAnalyticsFile(valencePlotFile);
    if (individual) {
      individual.valence_plot = key;
    }
    if (combined) {
      combined.valence_plot = key;
    }
  }
  if (ratioPlotFile) {
    const { key } = await saveAnalyticsFile(ratioPlotFile);
    if (individual) {
      individual.ratio_plot = key;
    }
    if (combined) {
      combined.ratio_plot = key;
    }
  }
  if (wordCloudFile) {
    const { key } = await saveAnalyticsFile(wordCloudFile);
    if (individual) {
      individual.word_cloud = key;
    }
  }
  const updated = await db
    .update(interviewSessions)
    .set({
      individualAnalytics: individual
        ? [
            ...(Array.isArray(session.individualAnalytics) ? session.individualAnalytics : []),
            {
              id: question_id,
              count,
              ...individual,
            },
          ]
        : undefined,
      combinedAnalytics: combined,
    })
    .where(eq(interviewSessions.uid, uid))
    .returning()
    .then((res) => res[0]);
  if (updated) {
    const session = getInterviewSessionWithSignedUrls(updated);
    io.to(`interview-session-${session.uid}`).emit("interview-session", session);
  }
  return res.status(StatusCodes.OK).json({ message: "Session analytics updated" });
});

export const uploadInterviewAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const file = req.file as MulterBlobFile;
  if (!file) {
    throw new AppError("No files were uploaded", StatusCodes.BAD_REQUEST);
  }
  const { uid, name, count } = req.body;
  const session = await db.query.interviewSessions.findFirst({ where: eq(interviewSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const { key } = await saveAnalyticsFile(file);
  if (!count) {
    await db
      .update(interviewSessions)
      .set({
        files: session.files ? { ...session.files, [name]: key } : { [name]: key },
      })
      .where(eq(interviewSessions.uid, uid));
  }
  return res.status(StatusCodes.OK).json({
    message: "File uploaded successfully!",
  });
});

export const updateInterviewAnalyticsLogSchema = z.object({
  body: z.object({
    uid: z.string(),
    message: z.string(),
  }),
});

export const updateInterviewAnalyticsLog: AppController = catchAsync(async (req, res) => {
  const { uid, message } = req.body as z.infer<typeof updateInterviewAnalyticsLogSchema>["body"];
  const session = await db.query.interviewSessions.findFirst({ where: eq(interviewSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const logs = session.logs ? [...session.logs, message] : [message];
  await db
    .update(interviewSessions)
    .set({
      logs,
    })
    .where(eq(interviewSessions.uid, uid));
  return res.status(StatusCodes.OK).json({ message: "Session updated" });
});

export const updateInterviewAnalyticsErrorSchema = z.object({
  body: z.object({
    uid: z.string(),
    user_id: z.string(),
    error: z.any(),
  }),
});

export const updateInterviewAnalyticsError: AppController = catchAsync(async (req, res) => {
  const { uid, error } = req.body as z.infer<typeof updateInterviewAnalyticsErrorSchema>["body"];
  const session = await db.query.interviewSessions.findFirst({ where: eq(interviewSessions.uid, uid) });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  const updated = await db
    .update(interviewSessions)
    .set({
      error,
    })
    .where(eq(interviewSessions.id, session.id))
    .returning()
    .then((res) => res[0]);
  io.to(`interview-session-${updated?.uid}`).emit("interview-session", updated);
  return res.status(StatusCodes.OK).json({ message: "Session error updated" });
});

export const downloadInterviewAnalyticsFileSchema = z.object({
  body: z.object({
    id: z.string(),
    count: z.number(),
    name: z.enum(["data_logs", "speech_logs"]),
  }),
});

export const downloadInterviewAnalyticsFile: AppController = catchAsync(async (req, res) => {
  const { id, count, name } = req.body as z.infer<typeof downloadInterviewAnalyticsFileSchema>["body"];
  const session = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, id),
  });
  if (!session) {
    throw new AppError("Session not found", StatusCodes.NOT_FOUND);
  }
  let key: string | undefined = undefined;
  if (count === 0) {
    key = session.files ? (session.files as Record<string, string>)[name] : undefined;
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
