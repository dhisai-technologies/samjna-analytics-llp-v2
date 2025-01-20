import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateId, generateName } from "../utils";

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

export type StressSession = typeof stressSessions.$inferSelect;
