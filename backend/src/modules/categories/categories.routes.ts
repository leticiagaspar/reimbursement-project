import { Router } from "express";
import * as categoriesController from "./categories.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { Role } from "@prisma/client";

const categoriesRoutes = Router();

categoriesRoutes.use(authMiddleware);

categoriesRoutes.get("/", categoriesController.list);

categoriesRoutes.post(
  "/",
  roleMiddleware([Role.ADMIN]),
  categoriesController.create,
);
categoriesRoutes.put(
  "/:id",
  roleMiddleware([Role.ADMIN]),
  categoriesController.update,
);

export { categoriesRoutes };
