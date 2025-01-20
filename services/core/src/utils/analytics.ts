import { db } from "@/db";
import type { MulterBlobFile } from "@/types";
import { type InterviewSession, type NursingSession, files } from "@lib/database";
import { getBlobUrl, uploadBlob } from "./blob";

export async function saveAnalyticsFile(file: MulterBlobFile) {
  const key = `${Date.now().toString()}-${file.originalname}`;
  uploadBlob(key, file);
  await db.insert(files).values({
    key,
    name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    userId: "",
    isAnalytics: true,
  });
  return { key, name: file.originalname };
}

export function getInterviewSessionWithSignedUrls(session: InterviewSession) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const currentSession = session as any;
  if (currentSession.combinedAnalytics?.valence_plot) {
    currentSession.combinedAnalytics.valence_plot = getBlobUrl(currentSession.combinedAnalytics?.valence_plot);
  }
  if (currentSession.combinedAnalytics?.ratio_plot) {
    currentSession.combinedAnalytics.ratio_plot = getBlobUrl(currentSession.combinedAnalytics?.ratio_plot);
  }
  if (Array.isArray(session.individualAnalytics)) {
    for (let i = 0; i < session.individualAnalytics.length; i++) {
      const individual = session.individualAnalytics[i];
      if (individual.valence_plot) {
        individual.valence_plot = getBlobUrl(individual.valence_plot);
      }
      if (individual.ratio_plot) {
        individual.ratio_plot = getBlobUrl(individual.ratio_plot);
      }
      if (individual.word_cloud) {
        individual.word_cloud = getBlobUrl(individual.word_cloud);
      }
    }
  }
  return session as InterviewSession;
}

export function getNursingSessionWithSignedUrls(session: NursingSession) {
  return session as NursingSession;
}
