import {
  downloadNursingAnalyticsFile,
  downloadNursingAnalyticsFileSchema,
  updateNursingAnalytics,
  updateNursingAnalyticsError,
  updateNursingAnalyticsErrorSchema,
  updateNursingAnalyticsLog,
  updateNursingAnalyticsLogSchema,
  uploadNursingAnalyticsFile,
} from "@/controllers/nursing/nursing-analytics.controller";
import { validateRequest } from "@lib/utils/middlewares";
import { Router } from "express";
import multer from "multer";

const router: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.fields([{ name: "json_data" }]), updateNursingAnalytics);
router.post("/file", upload.single("file"), uploadNursingAnalyticsFile);
router.post("/error", validateRequest(updateNursingAnalyticsErrorSchema), updateNursingAnalyticsError);
router.post("/info", validateRequest(updateNursingAnalyticsLogSchema), updateNursingAnalyticsLog);
router.post("/file/download", validateRequest(downloadNursingAnalyticsFileSchema), downloadNursingAnalyticsFile);

export default router;
