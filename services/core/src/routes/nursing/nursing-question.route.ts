import { config } from "@/config";
import {
  createCoreNursingQuestion,
  createCoreNursingQuestionSchema,
  createNursingQuestion,
  createNursingQuestionSchema,
  deleteCoreNursingQuestion,
  deleteCoreNursingQuestionSchema,
  deleteNursingQuestion,
  deleteNursingQuestionSchema,
  getCoreNursingQuestions,
  updateCoreNursingQuestion,
  updateCoreNursingQuestionSchema,
  updateNursingQuestion,
  updateNursingQuestionSchema,
} from "@/controllers/nursing/nursing-question.controller";
import { db } from "@/db";
import { validateRequest, verifyAuthentication, verifyAuthorization } from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

router.use(verifyAuthentication(db, config.SESSION_SECRET));

router.post(
  "/",
  verifyAuthorization(["ORGANIZATION"], ["NURSING"]),
  validateRequest(createNursingQuestionSchema),
  createNursingQuestion,
);
router.patch(
  "/",
  verifyAuthorization(["ORGANIZATION"], ["NURSING"]),
  validateRequest(updateNursingQuestionSchema),
  updateNursingQuestion,
);
router.delete(
  "/",
  verifyAuthorization(["ORGANIZATION"], ["NURSING"]),
  validateRequest(deleteNursingQuestionSchema),
  deleteNursingQuestion,
);

router.get("/core", verifyAuthorization(["ADMIN"], ["ADMIN"]), getCoreNursingQuestions);
router.post(
  "/core",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(createCoreNursingQuestionSchema),
  createCoreNursingQuestion,
);
router.patch(
  "/core",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(updateCoreNursingQuestionSchema),
  updateCoreNursingQuestion,
);
router.delete(
  "/core",
  verifyAuthorization(["ADMIN"], ["ADMIN"]),
  validateRequest(deleteCoreNursingQuestionSchema),
  deleteCoreNursingQuestion,
);

export default router;
