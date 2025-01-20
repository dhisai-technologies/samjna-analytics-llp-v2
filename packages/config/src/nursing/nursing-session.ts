import type { NursingAnalytics } from "./nursing-analytics";

export type NursingSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  key: string | null;
  logs: string[] | null;
  name: string;
  uid: string;
  individualAnalytics?: NursingAnalytics[] | null;
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
