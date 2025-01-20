import { markNotificationAsRead } from "@/controllers/notification.controller";
import { Router } from "express";

const router: Router = Router();

router.patch("/:id", markNotificationAsRead);

export default router;
