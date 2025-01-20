import { config } from "@/config";
import {
  createNursingTest,
  createNursingTestSchema,
  deleteNursingTest,
  deleteNursingTestSchema,
  getNursingAssessment,
  getNursingAssessmentSchema,
  getNursingParticipants,
  getNursingTest,
  getNursingTests,
  updateNursingParticipant,
  updateNursingParticipantSchema,
  updateNursingTest,
  updateNursingTestSchema,
} from "@/controllers/nursing/nursing.controller";
import { db } from "@/db";
import type { NursingParticipant, NursingTest } from "@lib/database";
import {
  parseFiltering,
  parsePagination,
  parseSorting,
  validateRequest,
  verifyAuthentication,
  verifyAuthorization,
} from "@lib/utils/middlewares";
import { Router } from "express";
import NursingAnalyticsRouter from "./nursing-analytics.route";
import NursingQuestionRouter from "./nursing-question.route";
import NursingSessionRouter from "./nursing-session.route";

const router: Router = Router();

router.use("/analytics", NursingAnalyticsRouter);
router.use("/questions", NursingQuestionRouter);
router.use("/sessions", NursingSessionRouter);

router.post("/assessment", validateRequest(getNursingAssessmentSchema), getNursingAssessment);

router.use(verifyAuthentication(db, config.SESSION_SECRET), verifyAuthorization(["ORGANIZATION"], ["NURSING"]));
router.get(
  "/",
  parsePagination,
  parseSorting<NursingTest>({
    validColumns: ["startTime", "title"],
  }),
  parseFiltering<NursingTest>({
    validColumns: ["startTime", "level"],
    validRules: ["between", "inArray"],
  }),
  getNursingTests,
);
router.get(
  "/participants",
  parsePagination,
  parseSorting<NursingParticipant>({
    validColumns: ["updatedAt", "id"],
  }),
  getNursingParticipants,
);
router.patch("/participants", validateRequest(updateNursingParticipantSchema), updateNursingParticipant);
router.get("/:id", getNursingTest);
router.post("/", validateRequest(createNursingTestSchema), createNursingTest);
router.patch("/", validateRequest(updateNursingTestSchema), updateNursingTest);
router.delete("/", validateRequest(deleteNursingTestSchema), deleteNursingTest);

export default router;
