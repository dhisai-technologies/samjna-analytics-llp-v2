import type { User } from "../core";

export const nursingLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type NursingLevel = (typeof nursingLevels)[number];

export type NursingTest = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  level: NursingLevel;
  participants: string[];
  userId: string;
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
};

export type NursingParticipant = {
  id: string;
  uid: string;
  nursingTestId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export * from "./nursing-question";
export * from "./nursing-session";
export * from "./nursing-analytics";
