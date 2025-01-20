import { config } from "@/config";
import {
  createModel,
  deleteModel,
  getModel,
  getModels,
  updateModel,
  updateModelSchema,
} from "@/controllers/model.controller";
import { db } from "@/db";
import type { Model } from "@lib/database";
import { parsePagination, parseSorting, validateRequest, verifyAuthentication } from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/:id", getModel);

router.use(verifyAuthentication(db, config.SESSION_SECRET));

router.get(
  "/",
  parsePagination,
  parseSorting<Model>({
    validColumns: ["updatedAt", "createdAt"],
  }),
  getModels,
);
router.post("/", upload.single("files"), createModel);
router.patch("/", validateRequest(updateModelSchema), updateModel);
router.delete("/", deleteModel);

export default router;
