import {
  createStroopTestSession,
  createStroopTestSessionSchema,
  deleteStroopTestSession,
  deleteStroopTestSessionSchema,
  getStroopTestSession,
  getStroopTestSessions,
  updateStroopTestSession,
  updateStroopTestSessionSchema,
} from "@/controllers/stress/stroop-test-session.controller";
import type { StroopTestSession } from "@lib/database";
import { parseFiltering, parsePagination, parseSorting, validateRequest } from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

router.get(
  "/",
  parsePagination,
  parseSorting<StroopTestSession>({
    validColumns: ["createdAt", "updatedAt"],
  }),
  parseFiltering<StroopTestSession>({
    validColumns: ["createdAt"],
    validRules: ["between"],
  }),
  getStroopTestSessions,
);
router.post("/", validateRequest(createStroopTestSessionSchema), createStroopTestSession);
router.get("/:id", getStroopTestSession);
router.patch("/", validateRequest(updateStroopTestSessionSchema), updateStroopTestSession);
router.delete("/", validateRequest(deleteStroopTestSessionSchema), deleteStroopTestSession);

export default router;
