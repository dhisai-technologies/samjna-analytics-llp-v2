import {
  downloadStressAnalyticsFile,
  downloadStressAnalyticsFileSchema,
  updateStressAnalytics,
  updateStressAnalyticsError,
  updateStressAnalyticsErrorSchema,
  uploadStressAnalyticsFile,
} from "@/controllers/stress/stress-analytics.controller";
import { validateRequest } from "@lib/utils/middlewares";
import { Router } from "express";
import multer from "multer";

const router: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.fields([{ name: "plot" }, { name: "json_data" }]), updateStressAnalytics);
router.post("/file", upload.single("file"), uploadStressAnalyticsFile);
router.post("/error", validateRequest(updateStressAnalyticsErrorSchema), updateStressAnalyticsError);
router.post("/file/download", validateRequest(downloadStressAnalyticsFileSchema), downloadStressAnalyticsFile);

export default router;
