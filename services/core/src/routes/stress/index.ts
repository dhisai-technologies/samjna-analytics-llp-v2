import { config } from "@/config";
import { db } from "@/db";
import { verifyAuthentication, verifyAuthorization } from "@lib/utils/middlewares";
import { Router } from "express";
import StressAnalyticsRouter from "./stress-analytics.route";
import StressSessionRouter from "./stress-session.route";

const router: Router = Router();

router.use("/analytics", StressAnalyticsRouter);
router.use(verifyAuthentication(db, config.SESSION_SECRET), verifyAuthorization(undefined, ["STRESS"]));
router.use("/sessions", StressSessionRouter);

export default router;
