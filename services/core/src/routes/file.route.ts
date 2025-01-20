import { config } from "@/config";
import {
  deleteFile,
  getAnalyticsVideoFiles,
  getFile,
  getFileFromKey,
  getFiles,
  updateFile,
  updateFileSchema,
  uploadAnalyticsFile,
  uploadFiles,
} from "@/controllers/file.controller";
import { db } from "@/db";
import type { File } from "@lib/database";
import { parsePagination, parseSorting, validateRequest, verifyAuthentication } from "@lib/utils/middlewares";
import { Router } from "express";

const router: Router = Router();

import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/analytics", upload.single("files"), uploadAnalyticsFile);

router.use(verifyAuthentication(db, config.SESSION_SECRET));

router.get(
  "/",
  parsePagination,
  parseSorting<File>({
    validColumns: ["updatedAt", "createdAt"],
  }),
  getFiles,
);
router.get(
  "/analytics",
  parsePagination,
  parseSorting<File>({
    validColumns: ["updatedAt", "createdAt"],
  }),
  getAnalyticsVideoFiles,
);
router.post("/upload", upload.array("files", 10), uploadFiles);
router.get("/key/:id", getFileFromKey);
router.get("/:id", getFile);
router.patch("/:id", validateRequest(updateFileSchema), updateFile);
router.delete("/:id", deleteFile);

export default router;
