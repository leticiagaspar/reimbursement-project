import { Router } from "express";
import multer from "multer";
import * as controller from "./reimbursements.controller";
import * as attachmentsController from "../attachments/attachments.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { Role } from "@prisma/client";

const reimbursementRoutes = Router();

const upload = multer({ dest: "uploads/" });

reimbursementRoutes.use(authMiddleware);

reimbursementRoutes.post("/", controller.create);
reimbursementRoutes.get("/", controller.list);
reimbursementRoutes.get("/:id", controller.getById);
reimbursementRoutes.put("/:id", controller.update);

reimbursementRoutes.post("/:id/submit", controller.submit);
reimbursementRoutes.post("/:id/cancel", controller.cancel);

reimbursementRoutes.post(
  "/:id/approve",
  roleMiddleware([Role.MANAGER, Role.ADMIN]),
  controller.approve,
);
reimbursementRoutes.post(
  "/:id/reject",
  roleMiddleware([Role.MANAGER, Role.ADMIN]),
  controller.reject,
);

reimbursementRoutes.post(
  "/:id/pay",
  roleMiddleware([Role.FINANCE, Role.ADMIN]),
  controller.pay,
);

reimbursementRoutes.get("/:id/history", controller.getHistory);

reimbursementRoutes.post(
  "/:id/attachments",
  upload.single("file"),
  attachmentsController.upload,
);
reimbursementRoutes.get("/:id/attachments", attachmentsController.list);

export { reimbursementRoutes };
