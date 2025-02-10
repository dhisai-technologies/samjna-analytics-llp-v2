import type { StroopTestAnalytics } from "./stroop-test-analytics";

export type StroopTestSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  key: string | null;
  logs: string[] | null;
  name: string;
  uid: string;
  individualAnalytics?: StroopTestAnalytics[];
  combinedAnalytics?: StroopTestAnalytics;
  individualFiles?:
    | {
        id: number;
        face_logs?: string;
        eye_logs?: string;
        speech_logs?: string;
        word_logs?: string;
      }[]
    | null;
  combinedFiles?: { face_logs?: string; eye_logs?: string } | null;
  user: {
    id: number;
    email: string;
    name: string;
    profile?: string;
  };
  error?: {
    message: string;
    trace: string;
  } | null;
};
