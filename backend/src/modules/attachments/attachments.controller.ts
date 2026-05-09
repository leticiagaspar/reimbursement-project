import { Request, Response } from "express";
import { z } from "zod";
import * as attachmentsService from "./attachments.service";
import { AppError } from "../../utils/AppError";

const idSchema = z.uuid("ID de reembolso inválido.");

export const upload = async (req: Request, res: Response) => {
  const reimbursementId = idSchema.parse(req.params.id);
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    throw new AppError(
      "Nenhum arquivo enviado. Use multipart/form-data com a chave 'file'.",
      400,
    );
  }

  const attachment = await attachmentsService.upload(
    reimbursementId,
    userId,
    file,
  );
  res.status(201).json(attachment);
};

export const list = async (req: Request, res: Response) => {
  const reimbursementId = idSchema.parse(req.params.id);
  const userId = req.user!.id;
  const role = req.user!.role;

  const attachments = await attachmentsService.listByReimbursement(
    reimbursementId,
    userId,
    role,
  );
  res.json(attachments);
};
