import { config } from "@/config";
import {
  createNursingSession,
  createNursingSessionSchema,
  deleteNursingSession,
  deleteNursingSessionSchema,
  getNursingSession,
  getNursingSessions,
  updateNursingSession,
  updateNursingSessionSchema,
} from "@/controllers/nursing/nursing-session.controller";

import { db } from "@/db";
import type { NursingSession } from "@lib/database";
import {
  parseFiltering,
  parsePagination,
  parseSorting,
  validateRequest,
  verifyAuthentication,
} from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

router.post("/", validateRequest(createNursingSessionSchema), createNursingSession);

router.use(verifyAuthentication(db, config.SESSION_SECRET));
router.get(
  "/",
  parsePagination,
  parseSorting<NursingSession>({
    validColumns: ["createdAt", "updatedAt"],
  }),
  parseFiltering<NursingSession>({
    validColumns: ["createdAt"],
    validRules: ["between"],
  }),
  getNursingSessions,
);
router.get("/:id", getNursingSession);
router.patch("/", validateRequest(updateNursingSessionSchema), updateNursingSession);
router.delete("/", validateRequest(deleteNursingSessionSchema), deleteNursingSession);

export default router;
