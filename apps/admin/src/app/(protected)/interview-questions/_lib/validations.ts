import { interviewQuestionTypes } from "@config/interview";
import { z } from "zod";

export const createInterviewQuestionSchema = z.object({
  order: z.string().transform((val) => Number.parseInt(val)),
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(interviewQuestionTypes),
  timeLimit: z.string().transform((val) => Number.parseInt(val)),
  file: z.any(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

export type CreateInterviewQuestionSchema = z.infer<typeof createInterviewQuestionSchema>;

export const updateInterviewQuestionSchema = createInterviewQuestionSchema.extend({
  coreInterviewQuestionId: z.string(),
});

export type UpdateInterviewQuestionSchema = z.infer<typeof updateInterviewQuestionSchema>;
