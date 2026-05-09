import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { Status, Role } from "@prisma/client";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

export const upload = async (
  reimbursementId: string,
  userId: string,
  file: Express.Multer.File,
) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new AppError(
      "Tipo de arquivo não permitido. Use PDF, JPG ou PNG.",
      400,
    );
  }

  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id: reimbursementId },
  });

  if (!reimbursement) throw new AppError("Reembolso não encontrado.", 404);

  if (reimbursement.userId !== userId) {
    throw new AppError(
      "Você não tem permissão para adicionar anexos nesta solicitação.",
      403,
    );
  }

  if (reimbursement.status !== Status.DRAFT) {
    throw new AppError(
      "Apenas solicitações em RASCUNHO podem receber anexos.",
      400,
    );
  }

  return await prisma.attachment.create({
    data: {
      reimbursementId,
      fileName: file.originalname,
      url: file.path,
      fileType: file.mimetype,
    },
  });
};

export const listByReimbursement = async (
  reimbursementId: string,
  userId: string,
  role: string,
) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id: reimbursementId },
  });

  if (!reimbursement) throw new AppError("Reembolso não encontrado.", 404);

  if (role === Role.EMPLOYEE && reimbursement.userId !== userId) {
    throw new AppError("Acesso negado.", 403);
  }

  return await prisma.attachment.findMany({
    where: { reimbursementId },
  });
};
