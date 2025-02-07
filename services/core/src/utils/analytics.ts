import { db } from "@/db";
import type { MulterBlobFile } from "@/types";
import {
  type InterviewSession,
  type NursingSession,
  type StressSession,
  type StroopTestSession,
  files,
} from "@lib/database";
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

export async function getSessionWithSignedUrls(session: StressSession) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const currentSession = session as any;
  if (currentSession.combinedAnalytics?.facial_emotion_recognition?.plot) {
    currentSession.combinedAnalytics.facial_emotion_recognition.plot = await getBlobUrl(
      currentSession.combinedAnalytics?.facial_emotion_recognition?.plot,
    );
  }
  if (Array.isArray(session.individualAnalytics)) {
    for (let i = 0; i < session.individualAnalytics.length; i++) {
      const individual = session.individualAnalytics[i];
      if (individual.facial_emotion_recognition?.plot) {
        individual.facial_emotion_recognition.plot = await getBlobUrl(individual.facial_emotion_recognition.plot);
      }
    }
  }
  return session;
}

export function getNursingSessionWithSignedUrls(session: NursingSession) {
  return session as NursingSession;
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

export function getStroopTestSessionWithSignedUrls(session: StroopTestSession) {
  return session as StroopTestSession;
}
