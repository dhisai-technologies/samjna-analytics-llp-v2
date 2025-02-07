import { sql } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateId, generateName } from "../utils";

export const stroopTestQuestions = pgTable("stroop_test_questions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  order: integer("order").default(0).notNull(),
  title: text("title").notNull(),
  level: varchar("level", { length: 255 }).notNull(),
  source: jsonb("source"),
  destination: jsonb("destination"),
  answer: jsonb("answer"),
  timeLimit: integer("time_limit").notNull().default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const stroopTestSessions = pgTable("stroop_test_sessions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull().unique(),
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

export const stressSessions = pgTable("stress_sessions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull().unique(),
  key: varchar("key", { length: 255 }),
  name: text("name")
    .notNull()
    .$default(() => generateName()),
  logs: text("logs").array().notNull().default(sql`ARRAY[]::text[]`),
  individualAnalytics: jsonb("individual_analytics"),
  combinedAnalytics: jsonb("combined_analytics"),
  combinedFiles: jsonb("combined_files"),
  error: jsonb("error"),
  userId: varchar("user_id", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type StroopTestQuestion = typeof stroopTestQuestions.$inferSelect;
export type StroopTestSession = typeof stroopTestSessions.$inferSelect;
export type StressSession = typeof stressSessions.$inferSelect;
