import { config } from "@/config";
import {
  createInterview,
  createInterviewSchema,
  deleteInterview,
  deleteInterviewSchema,
  getInterview,
  getInterviewAssessment,
  getInterviewAssessmentSchema,
  getInterviewParticipants,
  getInterviews,
  updateInterview,
  updateInterviewParticipant,
  updateInterviewParticipantSchema,
  updateInterviewSchema,
} from "@/controllers/interview/interview.controller";
import { db } from "@/db";
import type { Interview, InterviewParticipant } from "@lib/database";
import {
  parseFiltering,
  parsePagination,
  parseSorting,
  validateRequest,
  verifyAuthentication,
  verifyAuthorization,
} from "@lib/utils/middlewares";
import { Router } from "express";
import InterviewAnalyticsRouter from "./interview-analytics.route";
import InterviewQuestionRouter from "./interview-question.route";
import InterviewSessionRouter from "./interview-session.route";

const router: Router = Router();

router.use("/analytics", InterviewAnalyticsRouter);
router.use("/questions", InterviewQuestionRouter);
router.use("/sessions", InterviewSessionRouter);

router.post("/assessment", validateRequest(getInterviewAssessmentSchema), getInterviewAssessment);

router.use(verifyAuthentication(db, config.SESSION_SECRET), verifyAuthorization(["ORGANIZATION"], ["INTERVIEW"]));
router.get(
  "/",
  parsePagination,
  parseSorting<Interview>({
    validColumns: ["startTime", "title"],
  }),
  parseFiltering<Interview>({
    validColumns: ["startTime", "level"],
    validRules: ["between", "inArray"],
  }),
  getInterviews,
);
router.get(
  "/participants",
  parsePagination,
  parseSorting<InterviewParticipant>({
    validColumns: ["updatedAt", "id"],
  }),
  getInterviewParticipants,
);
router.patch("/participants", validateRequest(updateInterviewParticipantSchema), updateInterviewParticipant);
router.get("/:id", getInterview);
router.post("/", validateRequest(createInterviewSchema), createInterview);
router.patch("/", validateRequest(updateInterviewSchema), updateInterview);
router.delete("/", validateRequest(deleteInterviewSchema), deleteInterview);

export default router;
