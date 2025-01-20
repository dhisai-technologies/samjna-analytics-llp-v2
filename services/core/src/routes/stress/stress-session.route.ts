import { config } from "@/config";
import {
  createStressSession,
  createStressSessionSchema,
  deleteStressSession,
  deleteStressSessionSchema,
  getStressSession,
  getStressSessions,
  updateStressSession,
  updateStressSessionSchema,
} from "@/controllers/stress/stress-session.controller";

import { db } from "@/db";
import type { StressSession } from "@lib/database";
import {
  parseFiltering,
  parsePagination,
  parseSorting,
  validateRequest,
  verifyAuthentication,
} from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

router.use(verifyAuthentication(db, config.SESSION_SECRET));
router.post("/", validateRequest(createStressSessionSchema), createStressSession);
router.get(
  "/",
  parsePagination,
  parseSorting<StressSession>({
    validColumns: ["createdAt", "updatedAt"],
  }),
  parseFiltering<StressSession>({
    validColumns: ["createdAt"],
    validRules: ["between"],
  }),
  getStressSessions,
);
router.get("/:id", getStressSession);
router.patch("/", validateRequest(updateStressSessionSchema), updateStressSession);
router.delete("/", validateRequest(deleteStressSessionSchema), deleteStressSession);

export default router;
