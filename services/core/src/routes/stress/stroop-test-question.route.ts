import { config } from "@/config";
import {
  createStroopTestQuestion,
  createStroopTestQuestionSchema,
  deleteStroopTestQuestion,
  deleteStroopTestQuestionSchema,
  getStoopTestQuestions,
  updateStroopTestQuestion,
  updateStroopTestQuestionSchema,
} from "@/controllers/stress/stroop-test-question.controller";
import { db } from "@/db";
import type { StroopTestQuestion } from "@lib/database";
import { parseFiltering, validateRequest, verifyAuthentication, verifyAuthorization } from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

router.use(verifyAuthentication(db, config.SESSION_SECRET));

router.get(
  "/",
  parseFiltering<StroopTestQuestion>({
    validColumns: ["level"],
    validRules: ["eq"],
  }),
  getStoopTestQuestions,
);
router.post(
  "/",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(createStroopTestQuestionSchema),
  createStroopTestQuestion,
);
router.patch(
  "/",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(updateStroopTestQuestionSchema),
  updateStroopTestQuestion,
);
router.delete(
  "/",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(deleteStroopTestQuestionSchema),
  deleteStroopTestQuestion,
);

export default router;
