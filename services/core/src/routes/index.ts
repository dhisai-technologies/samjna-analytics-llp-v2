import { config } from "@/config";
import { db } from "@/db";
import { verifyAuthentication, verifyAuthorization } from "@lib/utils/middlewares";
import { Router } from "express";
import AuthRouter from "./auth.route";
import FileRouter from "./file.route";
import InterviewRouter from "./interview";
import ModelRouter from "./model.route";
import NotificationRouter from "./notification.route";
import NursingRouter from "./nursing";
import StressRouter from "./stress";
import UserRouter from "./user.route";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/interviews", InterviewRouter);
router.use("/nursing", NursingRouter);
router.use("/stress", StressRouter);
router.use("/files", FileRouter);
router.use("/models", ModelRouter);
router.use(verifyAuthentication(db, config.SESSION_SECRET));
router.use("/notifications", NotificationRouter);
router.use("/users", verifyAuthorization(["ADMIN"], ["ADMIN"]), UserRouter);

export default router;
