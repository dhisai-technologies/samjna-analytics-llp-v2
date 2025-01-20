import { modules, roles } from "@config/core";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(roles),
  module: z.enum(modules),
  maxParticipants: z.string().transform((str) => Number.parseInt(str)),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .omit({
    module: true,
  })
  .extend({
    userId: z.string(),
  });

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
