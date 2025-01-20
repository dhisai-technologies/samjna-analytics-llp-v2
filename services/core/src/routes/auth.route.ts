import { Router } from "express";

import { config } from "@/config";
import {
  refreshCredentials,
  requestOtp,
  requestOtpSchema,
  updateProfile,
  updateProfileSchema,
  verifyOtp,
  verifyOtpSchema,
} from "@/controllers/auth.controller";
import { db } from "@/db";
import { validateRequest, verifyAuthentication } from "@lib/utils/middlewares";

const router: Router = Router();

router.post("/request-otp", validateRequest(requestOtpSchema), requestOtp);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOtp);

router.use(verifyAuthentication(db, config.SESSION_SECRET));

router.post("/refresh-credentials", refreshCredentials);
router.patch("/profile", validateRequest(updateProfileSchema), updateProfile);

export default router;
