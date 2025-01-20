import {
  downloadInterviewAnalyticsFile,
  downloadInterviewAnalyticsFileSchema,
  updateInterviewAnalytics,
  updateInterviewAnalyticsError,
  updateInterviewAnalyticsErrorSchema,
  updateInterviewAnalyticsLog,
  updateInterviewAnalyticsLogSchema,
  uploadInterviewAnalyticsFile,
} from "@/controllers/interview/interview-analytics.controller";
import { validateRequest } from "@lib/utils/middlewares";
import { Router } from "express";
import multer from "multer";

const router: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  upload.fields([{ name: "valence_plot" }, { name: "ratio_plot" }, { name: "word_cloud" }, { name: "json_data" }]),
  updateInterviewAnalytics,
);
router.post("/file", upload.single("file"), uploadInterviewAnalyticsFile);
router.post("/error", validateRequest(updateInterviewAnalyticsErrorSchema), updateInterviewAnalyticsError);
router.post("/info", validateRequest(updateInterviewAnalyticsLogSchema), updateInterviewAnalyticsLog);
router.post("/file/download", validateRequest(downloadInterviewAnalyticsFileSchema), downloadInterviewAnalyticsFile);

export default router;
