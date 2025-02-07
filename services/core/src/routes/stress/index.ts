import { config } from "@/config";
import { db } from "@/db";
import { verifyAuthentication } from "@lib/utils/middlewares";
import { Router } from "express";
import StressAnalyticsRouter from "./stress-analytics.route";
import StressSessionRouter from "./stress-session.route";
import StroopTestAnalyticsRouter from "./stroop-test-analytics.route";
import StroopTestQuestionRouter from "./stroop-test-question.route";
import StroopTestSessionRouter from "./stroop-test-session.route";

const router: Router = Router();

router.use("/analytics", StressAnalyticsRouter);
router.use("/stroop-test/analytics", StroopTestAnalyticsRouter);
router.use(verifyAuthentication(db, config.SESSION_SECRET));
router.use("/sessions", StressSessionRouter);
router.use("/stroop-test/sessions", StroopTestSessionRouter);
router.use("/stroop-test/questions", StroopTestQuestionRouter);

export default router;
