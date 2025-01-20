import { interviewLevels } from "@config/interview";
import { z } from "zod";

export const createInterviewSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  startTime: z.string().transform((str) => new Date(str)),
  level: z.enum(interviewLevels),
});

export type CreateInterviewSchema = z.infer<typeof createInterviewSchema>;

export const updateInterviewSchema = createInterviewSchema.extend({
  interviewId: z.string(),
});

export type UpdateInterviewSchema = z.infer<typeof updateInterviewSchema>;
