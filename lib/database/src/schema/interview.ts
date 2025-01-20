import { sql } from "drizzle-orm";
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateId, generateName } from "../utils";

export const interviewQuestionTypesEnum = pgEnum("interview_question_type", [
  "TEXT",
  "SELECT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
]);

export const coreInterviewQuestions = pgTable("core_interview_questions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  order: integer("order").default(0).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category", { length: 255 }),
  type: interviewQuestionTypesEnum("type").default("TEXT").notNull(),
  active: boolean("active").default(true).notNull(),
  recordVideo: boolean("record_video").default(true).notNull(),
  timeLimit: integer("time_limit").notNull().default(0),
  options: jsonb("options"),
  file: text("file"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const interviewLevelsEnum = pgEnum("interview_level", ["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const interviews = pgTable("interviews", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  level: interviewLevelsEnum("level").default("BEGINNER").notNull(),
  userId: varchar("user_id", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const interviewQuestions = pgTable("interview_questions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  interviewId: varchar("interview_id", { length: 30 })
    .references(() => interviews.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").default(0).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category", { length: 255 }),
  type: interviewQuestionTypesEnum("type").default("TEXT").notNull(),
  active: boolean("active").default(true).notNull(),
  recordVideo: boolean("record_video").default(true).notNull(),
  timeLimit: integer("time_limit").notNull().default(0),
  options: jsonb("options"),
  file: text("file"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const interviewParticipants = pgTable("interview_participants", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull().default("USR-00"),
  interviewId: varchar("interview_id", { length: 30 })
    .references(() => interviews.id, { onDelete: "cascade" })
    .notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const interviewSessions = pgTable("interview_sessions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull().unique(),
  interviewId: varchar("interview_id", { length: 30 })
    .references(() => interviews.id, { onDelete: "cascade" })
    .notNull(),
  key: varchar("key", { length: 255 }),
  name: text("name")
    .notNull()
    .$default(() => generateName()),
  logs: text("logs").array().notNull().default(sql`ARRAY[]::text[]`),
  individualAnalytics: jsonb("individual_analytics"),
  combinedAnalytics: jsonb("combined_analytics"),
  files: jsonb("files"),
  error: jsonb("error"),
  userId: varchar("user_id", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CoreInterviewQuestion = typeof coreInterviewQuestions.$inferSelect;
export type Interview = typeof interviews.$inferSelect;
export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type InterviewParticipant = typeof interviewParticipants.$inferSelect;
export type InterviewSession = typeof interviewSessions.$inferSelect;
