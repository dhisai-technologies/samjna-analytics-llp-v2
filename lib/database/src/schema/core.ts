import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { generateNumericId } from "../utils";
import { generateId } from "../utils";

export const users = pgTable("users", {
  id: varchar("uid", { length: 30 })
    .$defaultFn(() => generateNumericId("USR"))
    .primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: text("name"),
  role: varchar("role", {
    length: 30,
  }).notNull(),
  active: boolean("active").default(true).notNull(),
  module: varchar("module", {
    length: 30,
  }).notNull(),
  maxParticipants: integer("max_participants").default(1).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 30 }).notNull().unique(),
  otp: varchar("otp", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  retries: integer("retries").default(0).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  userId: varchar("user_id", { length: 30 }).notNull(),
  type: varchar("type", { length: 255 }).default("COMMON").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const files = pgTable("files", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  userId: varchar("user_id", { length: 30 }).notNull(),
  mimetype: text("mimetype").notNull(),
  size: doublePrecision("size").notNull(),
  readableBy: jsonb("readable_by"),
  readableUpto: timestamp("readable_upto").notNull().defaultNow(),
  isPublic: boolean("is_public").default(false).notNull(),
  isAnalytics: boolean("is_analytics").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const models = pgTable("models", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  mimetype: text("mimetype").notNull(),
  size: doublePrecision("size").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type Otp = typeof otps.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type File = typeof files.$inferSelect;
export type Model = typeof models.$inferSelect;
