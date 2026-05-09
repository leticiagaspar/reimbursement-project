import { Router } from "express";
import * as controller from "./users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { Role } from "@prisma/client";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema } from "./users.schema";

const usersRoutes = Router();

usersRoutes.post("/", validate(createUserSchema), controller.create);

usersRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  controller.list,
);

export { usersRoutes };
