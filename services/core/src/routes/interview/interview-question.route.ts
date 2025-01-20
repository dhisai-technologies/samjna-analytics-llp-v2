import { config } from "@/config";
import {
  createCoreInterviewQuestion,
  createCoreInterviewQuestionSchema,
  createInterviewQuestion,
  createInterviewQuestionSchema,
  deleteCoreInterviewQuestion,
  deleteCoreInterviewQuestionSchema,
  deleteInterviewQuestion,
  deleteInterviewQuestionSchema,
  getCoreInterviewQuestions,
  updateCoreInterviewQuestion,
  updateCoreInterviewQuestionSchema,
  updateInterviewQuestion,
  updateInterviewQuestionSchema,
} from "@/controllers/interview/interview-question.controller";
import { db } from "@/db";
import { validateRequest, verifyAuthentication, verifyAuthorization } from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

router.use(verifyAuthentication(db, config.SESSION_SECRET));

router.post(
  "/",
  verifyAuthorization(["ORGANIZATION"], ["INTERVIEW"]),
  validateRequest(createInterviewQuestionSchema),
  createInterviewQuestion,
);
router.patch(
  "/",
  verifyAuthorization(["ORGANIZATION"], ["INTERVIEW"]),
  validateRequest(updateInterviewQuestionSchema),
  updateInterviewQuestion,
);
router.delete(
  "/",
  verifyAuthorization(["ORGANIZATION"], ["INTERVIEW"]),
  validateRequest(deleteInterviewQuestionSchema),
  deleteInterviewQuestion,
);

router.get("/core", verifyAuthorization(["ADMIN"], ["ADMIN"]), getCoreInterviewQuestions);
router.post(
  "/core",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(createCoreInterviewQuestionSchema),
  createCoreInterviewQuestion,
);
router.patch(
  "/core",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(updateCoreInterviewQuestionSchema),
  updateCoreInterviewQuestion,
);
router.delete(
  "/core",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(deleteCoreInterviewQuestionSchema),
  deleteCoreInterviewQuestion,
);

export default router;
