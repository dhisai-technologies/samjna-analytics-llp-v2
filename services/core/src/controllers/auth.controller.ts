import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { config } from "@/config";
import { db } from "@/db";
import { generateOtp, mailOtp } from "@/utils/otp";
import { otps, users } from "@lib/database";
import { type AppController, AppError, StatusCodes, catchAsync } from "@lib/utils/errors";
import { encrypt } from "@lib/utils/helpers";
import type { SessionData } from "@lib/utils/types";

export const requestOtpSchema = z.object({
  body: z.object({
    email: z.string(),
    module: z.string(),
  }),
});

export const requestOtp: AppController = catchAsync(async (req, res) => {
  const { email, module } = req.parsed?.body as z.infer<typeof requestOtpSchema>["body"];
  const user = await db.query.users.findFirst({
    where: and(eq(users.email, email), eq(users.module, module)),
  });
  if (!user) {
    throw new AppError("Invalid email", StatusCodes.BAD_REQUEST);
  }
  if (!user.active) {
    throw new AppError("User is not active", StatusCodes.BAD_REQUEST);
  }
  const existing = await db.query.otps.findFirst({
    where: eq(otps.userId, user.id),
  });
  if (!existing) {
    const { otp, expiresAt } = generateOtp();
    await db.insert(otps).values({
      userId: user.id,
      otp,
      expiresAt,
      retries: 1,
    });
    await mailOtp(user.email, otp);
    return res.status(StatusCodes.OK).json({
      message: "Otp sent successfully to your mail",
    });
  }
  if (existing.retries < config.OTP_RETRIES && new Date().getTime() < existing.expiresAt.getTime()) {
    await db
      .update(otps)
      .set({
        retries: sql`${otps.retries} + 1`,
      })
      .where(eq(otps.id, existing.id));
    console.log("OTP: ", existing.otp);
    await mailOtp(user.email, existing.otp);
    return res.status(StatusCodes.OK).json({
      message: "Otp sent successfully to your mail",
    });
  }
  // const suspendedDate = new Date(existing.updatedAt.getTime() + config.OTP_SUSPEND_TIME * 60 * 1000);
  // if (existing.retries >= config.OTP_RETRIES && new Date().getTime() < suspendedDate.getTime()) {
  //   logger.trace({
  //     userId: user.id,
  //     event: "Auth",
  //     message: `Account suspended for ${config.OTP_SUSPEND_TIME} minutes`,
  //   });
  //   throw new AppError(
  //     `Your account has been suspended for ${config.OTP_SUSPEND_TIME} minutes, please try later`,
  //     StatusCodes.BAD_REQUEST,
  //   );
  // }
  const { otp, expiresAt } = generateOtp();
  await db
    .update(otps)
    .set({
      otp,
      expiresAt,
      retries: 1,
    })
    .where(eq(otps.id, existing.id));
  console.log("OTP: ", otp);
  await mailOtp(user.email, otp);
  return res.status(StatusCodes.OK).json({
    message: "Otp sent successfully to your mail",
  });
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string(),
    module: z.string(),
    otp: z.string(),
  }),
});

export const verifyOtp: AppController = catchAsync(async (req, res) => {
  const { email, module } = req.parsed?.body as z.infer<typeof verifyOtpSchema>["body"];
  const user = await db.query.users.findFirst({
    where: and(eq(users.email, email), eq(users.module, module)),
  });
  if (!user) {
    throw new AppError("Invalid email or otp", StatusCodes.BAD_REQUEST);
  }
  if (!user.active) {
    throw new AppError("Invalid email or otp", StatusCodes.BAD_REQUEST);
  }
  // const savedOtp = await db.query.otps.findFirst({
  //   where: eq(otps.userId, user.id),
  // });
  // if (!savedOtp || savedOtp.otp !== otp) {
  //   throw new AppError("Invalid email or otp", StatusCodes.BAD_REQUEST);
  // }
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    module: user.module,
  };
  const session = await encrypt(payload as SessionData, config.SESSION_SECRET);
  return res.status(StatusCodes.OK).json({
    message: "Logged in successfully",
    data: {
      user: payload,
      session,
    },
  });
});

export const refreshCredentials: AppController = catchAsync(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    module: user.module,
  };
  const session = await encrypt(payload as SessionData, config.SESSION_SECRET);
  return res.status(StatusCodes.OK).json({
    message: "Refreshed Credentials Successfully",
    data: {
      user: payload,
      session,
    },
  });
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const updateProfile: AppController = catchAsync(async (req, res) => {
  const { name } = req.body as z.infer<typeof updateProfileSchema>["body"];
  if (!req.user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const updated = await db
    .update(users)
    .set({ name })
    .where(eq(users.id, req.user.id))
    .returning()
    .then((res) => res[0]);
  return res.status(StatusCodes.OK).json({
    message: "Updated user successfully",
    data: {
      user: {
        email: updated?.email,
        name: updated?.name,
        role: updated?.role,
      },
    },
  });
});
