import { modules } from "@config/core";
import { z } from "zod";

export const requestUserOtpSchema = z.object({
  email: z.string().email(),
  module: z.enum(modules),
});

export type RequestUserOtpSchema = z.infer<typeof requestUserOtpSchema>;

export const verifyUserOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
  module: z.enum(modules),
});

export type VerifyUserOtpSchema = z.infer<typeof verifyUserOtpSchema>;

export const assessmentSchema = z.object({
  resourceId: z.string(),
  participantId: z.string(),
});

export type AssessmentSchema = z.infer<typeof assessmentSchema>;
