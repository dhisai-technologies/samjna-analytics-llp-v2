import type { StressAnalytics } from "./stress-analytics";

export type StressSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  key: string | null;
  logs: string[] | null;
  name: string;
  uid: string;
  individualAnalytics?: StressAnalytics[] | null;
  combinedAnalytics?: StressAnalytics | null;
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
