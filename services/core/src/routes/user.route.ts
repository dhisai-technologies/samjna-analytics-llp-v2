import { Router } from "express";

import type { User } from "@lib/database";
import { parseFiltering, parsePagination, parseSorting, validateRequest } from "@lib/utils/middlewares";

import { createUser, createUserSchema, getUsers, updateUser, updateUserSchema } from "@/controllers/user.controller";

const router: Router = Router();

router.get(
  "/",
  parsePagination,
  parseSorting<User>({
    validColumns: ["name", "email"],
  }),
  parseFiltering<User>({
    validColumns: ["role", "module"],
    validRules: ["inArray"],
  }),
  getUsers,
);
router.post("/", validateRequest(createUserSchema), createUser);
router.patch("/", validateRequest(updateUserSchema), updateUser);

export default router;
