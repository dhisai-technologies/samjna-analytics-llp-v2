import { stroopTestLevels } from "@config/stress";
import { z } from "zod";

export const createStroopTestQuestionSchema = z.object({
  title: z.string(),
  level: z.enum(stroopTestLevels),
  order: z.string().transform((val) => Number.parseInt(val)),
  timeLimit: z.string().transform((val) => Number.parseInt(val)),
  answer: z.string(),
  sourceLabel: z.string(),
  sourceColor: z.string(),
  destination: z.array(z.object({ id: z.string(), label: z.string(), color: z.string() })),
});

export type CreateStroopTestQuestionSchema = z.infer<typeof createStroopTestQuestionSchema>;

export const updateStroopTestQuestionSchema = createStroopTestQuestionSchema.extend({
  stroopTestQuestionId: z.string(),
});

export type UpdateStroopTestQuestionSchema = z.infer<typeof updateStroopTestQuestionSchema>;
