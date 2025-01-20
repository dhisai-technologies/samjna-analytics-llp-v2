import type { User } from "../core";

export const interviewLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type InterviewLevel = (typeof interviewLevels)[number];

export type Interview = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  level: InterviewLevel;
  participants: string[];
  userId: string;
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
};

export type InterviewParticipant = {
  id: string;
  uid: string;
  interviewId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export * from "./interview-question";
export * from "./interview-session";
export * from "./interview-analytics";
