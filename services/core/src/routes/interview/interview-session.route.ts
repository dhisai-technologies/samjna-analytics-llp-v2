import { config } from "@/config";
import {
  createInterviewSession,
  createInterviewSessionSchema,
  deleteInterviewSession,
  deleteInterviewSessionSchema,
  getInterviewSession,
  getInterviewSessions,
  updateInterviewSession,
  updateInterviewSessionSchema,
} from "@/controllers/interview/interview-session.controller";

import { db } from "@/db";
import type { InterviewSession } from "@lib/database";
import {
  parseFiltering,
  parsePagination,
  parseSorting,
  validateRequest,
  verifyAuthentication,
} from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

router.post("/", validateRequest(createInterviewSessionSchema), createInterviewSession);

router.use(verifyAuthentication(db, config.SESSION_SECRET));
router.get(
  "/",
  parsePagination,
  parseSorting<InterviewSession>({
    validColumns: ["createdAt", "updatedAt"],
  }),
  parseFiltering<InterviewSession>({
    validColumns: ["createdAt"],
    validRules: ["between"],
  }),
  getInterviewSessions,
);
router.get("/:id", getInterviewSession);
router.patch("/", validateRequest(updateInterviewSessionSchema), updateInterviewSession);
router.delete("/", validateRequest(deleteInterviewSessionSchema), deleteInterviewSession);

export default router;
