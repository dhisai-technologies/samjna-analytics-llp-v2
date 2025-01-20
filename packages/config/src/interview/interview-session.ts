import type { InterviewAnalytics } from "./interview-analytics";

export type InterviewSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  key: string | null;
  logs: string[] | null;
  name: string;
  uid: string;
  individualAnalytics?: InterviewAnalytics[] | null;
  combinedAnalytics?: InterviewAnalytics | null;
  files?: { face_logs?: string; eye_logs?: string } | null;
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
