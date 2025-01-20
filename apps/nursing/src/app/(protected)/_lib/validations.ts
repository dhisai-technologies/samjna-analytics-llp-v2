import { nursingLevels } from "@config/nursing";
import { z } from "zod";

export const createNursingTestSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  startTime: z.string().transform((str) => new Date(str)),
  level: z.enum(nursingLevels),
});

export type CreateNursingTestSchema = z.infer<typeof createNursingTestSchema>;

export const updateNursingTestSchema = createNursingTestSchema.extend({
  nursingTestId: z.string(),
});

export type UpdateNursingTestSchema = z.infer<typeof updateNursingTestSchema>;
