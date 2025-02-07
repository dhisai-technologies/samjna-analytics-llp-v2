import {
  downloadStroopTestAnalyticsFile,
  downloadStroopTestAnalyticsFileSchema,
  updateStroopTestAnalytics,
  updateStroopTestAnalyticsError,
  updateStroopTestAnalyticsErrorSchema,
  updateStroopTestAnalyticsLog,
  updateStroopTestAnalyticsLogSchema,
  uploadStroopTestAnalyticsFile,
} from "@/controllers/stress/stroop-test-analytics.controller";
import { validateRequest } from "@lib/utils/middlewares";
import { Router } from "express";
import multer from "multer";

const router: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.fields([{ name: "json_data" }]), updateStroopTestAnalytics);
router.post("/file", upload.single("file"), uploadStroopTestAnalyticsFile);
router.post("/error", validateRequest(updateStroopTestAnalyticsErrorSchema), updateStroopTestAnalyticsError);
router.post("/info", validateRequest(updateStroopTestAnalyticsLogSchema), updateStroopTestAnalyticsLog);
router.post("/file/download", validateRequest(downloadStroopTestAnalyticsFileSchema), downloadStroopTestAnalyticsFile);

export default router;
