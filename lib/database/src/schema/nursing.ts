import { sql } from "drizzle-orm";
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateId, generateName } from "../utils";

export const nursingQuestionTypesEnum = pgEnum("nursing_question_type", ["TEXT", "SELECT", "IMAGE", "AUDIO", "VIDEO"]);

export const coreNursingQuestions = pgTable("core_nursing_questions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  order: integer("order").default(0).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category", { length: 255 }),
  type: nursingQuestionTypesEnum("type").default("TEXT").notNull(),
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

export const nursingLevelsEnum = pgEnum("nursing_level", ["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const nursingTests = pgTable("nursing_tests", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  level: nursingLevelsEnum("level").default("BEGINNER").notNull(),
  userId: varchar("user_id", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const nursingQuestions = pgTable("nursing_questions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  nursingTestId: varchar("nursing_test_id", { length: 30 })
    .references(() => nursingTests.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").default(0).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category", { length: 255 }),
  type: nursingQuestionTypesEnum("type").default("TEXT").notNull(),
  active: boolean("active").default(true).notNull(),
  timeLimit: integer("time_limit").notNull().default(0),
  recordVideo: boolean("record_video").default(true).notNull(),
  options: jsonb("options"),
  file: text("file"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const nursingParticipants = pgTable("nursing_participants", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull().default("USR-00"),
  nursingTestId: varchar("nursing_test_id", { length: 30 })
    .references(() => nursingTests.id, { onDelete: "cascade" })
    .notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const nursingSessions = pgTable("nursing_sessions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull().unique(),
  nursingTestId: varchar("nursing_test_id", { length: 30 })
    .references(() => nursingTests.id, { onDelete: "cascade" })
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

export type CoreNursingQuestion = typeof coreNursingQuestions.$inferSelect;
export type NursingTest = typeof nursingTests.$inferSelect;
export type NursingQuestion = typeof nursingQuestions.$inferSelect;
export type NursingParticipant = typeof nursingParticipants.$inferSelect;
export type NursingSession = typeof nursingSessions.$inferSelect;
