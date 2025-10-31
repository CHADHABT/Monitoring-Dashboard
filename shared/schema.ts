import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Connection schema for MongoDB connections
export const connectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string(),
  database: z.string(),
  collection: z.string(),
  status: z.string(),
});

export const insertConnectionSchema = connectionSchema.omit({ id: true, status: true }).partial({ collection: true });

export type Connection = z.infer<typeof connectionSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;

// Document schema for MongoDB documents
export const documentSchema = z.object({
  _id: z.string(),
  RefDoc: z.string().optional(),
  YoozDocNum: z.string(),
  Type: z.string(),
  Status: z.enum(["LOADED", "FAILED", "OPEN"]),
  Payload: z.any(),
  PDFContent: z.string().optional(),
  Last_updated: z.string().optional(),
});

export type Document = z.infer<typeof documentSchema>;
