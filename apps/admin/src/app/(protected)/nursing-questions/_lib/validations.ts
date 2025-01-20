import { nursingQuestionTypes } from "@config/nursing";
import { z } from "zod";

export const createNursingQuestionSchema = z.object({
  order: z.string().transform((val) => Number.parseInt(val)),
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(nursingQuestionTypes),
  timeLimit: z.string().transform((val) => Number.parseInt(val)),
  file: z.any(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

export type CreateNursingQuestionSchema = z.infer<typeof createNursingQuestionSchema>;

export const updateNursingQuestionSchema = createNursingQuestionSchema.extend({
  coreNursingQuestionId: z.string(),
});

export type UpdateNursingQuestionSchema = z.infer<typeof updateNursingQuestionSchema>;
