import { prisma } from "../../config/prisma";
import { CreateReimbursementInput } from "./reimbursements.schema";
import { AppError } from "../../utils/AppError";
import { Status, Action, Role } from "@prisma/client";
import { generateUpdateObservation } from "../../utils/reimbursement-helper";

export const create = async (
  userId: string,
  data: CreateReimbursementInput,
) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) throw new AppError("Categoria não encontrada.", 404);
  if (!category.active) throw new AppError("Esta categoria está inativa.", 400);

  return await prisma.$transaction(async (tx) => {
    const reimbursement = await tx.reimbursement.create({
      data: { ...data, userId, status: Status.DRAFT },
    });

    await tx.history.create({
      data: {
        reimbursementId: reimbursement.id,
        userId,
        action: Action.CREATED,
        observation: "Criado como rascunho.",
      },
    });

    return reimbursement;
  });
};

export const list = async (
  userId: string,
  role: string,
  filters?: {
    status?: Status;
    categoryId?: string;
    search?: string;
    sort?: "asc" | "desc";
    page?: number;
    limit?: number;
  },
) => {
  const includeData = { user: { select: { name: true } }, category: true };

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const skip = (page - 1) * limit;
  const orderBy = { expenseDate: filters?.sort ?? "desc" };

  const extraFilter: any = {};
  if (filters?.categoryId) extraFilter.categoryId = filters.categoryId;

  if (filters?.search) {
    extraFilter.user = {
      name: { contains: filters.search, mode: "insensitive" },
    };
  }

  let statusFilter: Status | undefined;
  if (role === Role.MANAGER) statusFilter = Status.SUBMITTED;
  if (role === Role.FINANCE) statusFilter = Status.APPROVED;

  const finalStatus = filters?.status ?? statusFilter;
  if (finalStatus) extraFilter.status = finalStatus;

  const whereCondition =
    role === Role.EMPLOYEE ? { userId, ...extraFilter } : extraFilter;

  const [items, total] = await prisma.$transaction([
    prisma.reimbursement.findMany({
      where: whereCondition,
      include: includeData,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.reimbursement.count({ where: whereCondition }),
  ]);

  return {
    data: items,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  };
};

export const findById = async (id: string, userId: string, role: string) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id },
    include: {
      category: true,
      user: { select: { id: true, name: true, email: true } },
      histories: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      attachments: true,
    },
  });

  if (!reimbursement) throw new AppError("Reembolso não encontrado.", 404);

  if (role === Role.EMPLOYEE && reimbursement.userId !== userId)
    throw new AppError("Acesso negado.", 403);

  return reimbursement;
};

export const update = async (
  id: string,
  userId: string,
  data: Partial<CreateReimbursementInput>,
) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!reimbursement) throw new AppError("Reembolso não encontrado.", 404);
  if (reimbursement.userId !== userId)
    throw new AppError("Você não pode editar solicitações de terceiros.", 403);
  if (reimbursement.status !== Status.DRAFT)
    throw new AppError("Apenas rascunhos podem ser editados.", 400);

  let newCategoryName: string | undefined;

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new AppError("Categoria não encontrada.", 404);
    if (!category.active)
      throw new AppError("Esta categoria está inativa.", 400);

    newCategoryName = category.name;
  }

  const observation = generateUpdateObservation(
    reimbursement,
    data,
    newCategoryName,
  );

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.reimbursement.update({
      where: { id },
      data,
    });

    await tx.history.create({
      data: {
        reimbursementId: id,
        userId,
        action: Action.UPDATED,
        observation,
      },
    });

    return updated;
  });
};

export const submit = async (id: string, userId: string) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id },
  });

  if (!reimbursement) throw new AppError("Não encontrado.", 404);
  if (reimbursement.userId !== userId)
    throw new AppError("Acesso negado.", 403);
  if (reimbursement.status !== Status.DRAFT)
    throw new AppError("Apenas rascunhos podem ser enviados.", 400);

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.reimbursement.update({
      where: { id },
      data: { status: Status.SUBMITTED },
    });

    await tx.history.create({
      data: {
        reimbursementId: id,
        userId,
        action: Action.SUBMITTED,
        observation: "Solicitação enviada para aprovação.",
      },
    });

    return updated;
  });
};

export const approve = async (id: string, gestorId: string) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id },
  });

  if (!reimbursement) throw new AppError("Não encontrado.", 404);
  if (reimbursement.status !== Status.SUBMITTED)
    throw new AppError(
      "Apenas solicitações ENVIADAS podem ser aprovadas.",
      400,
    );

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.reimbursement.update({
      where: { id },
      data: { status: Status.APPROVED },
    });

    await tx.history.create({
      data: {
        reimbursementId: id,
        userId: gestorId,
        action: Action.APPROVED,
        observation: "Aprovado pelo gestor.",
      },
    });

    return updated;
  });
};

export const reject = async (id: string, gestorId: string, reason: string) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id },
  });

  if (!reimbursement) throw new AppError("Não encontrado.", 404);
  if (reimbursement.status !== Status.SUBMITTED)
    throw new AppError(
      "Apenas solicitações ENVIADAS podem ser rejeitadas.",
      400,
    );

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.reimbursement.update({
      where: { id },
      data: {
        status: Status.REJECTED,
        rejectionReason: reason,
      },
    });

    await tx.history.create({
      data: {
        reimbursementId: id,
        userId: gestorId,
        action: Action.REJECTED,
        observation: `Rejeitado: ${reason}`,
      },
    });

    return updated;
  });
};

export const pay = async (id: string, financeiroId: string) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id },
  });

  if (!reimbursement) throw new AppError("Não encontrado.", 404);
  if (reimbursement.status !== Status.APPROVED)
    throw new AppError("Apenas solicitações APROVADAS podem ser pagas.", 400);

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.reimbursement.update({
      where: { id },
      data: { status: Status.PAID },
    });

    await tx.history.create({
      data: {
        reimbursementId: id,
        userId: financeiroId,
        action: Action.PAID,
        observation: "Pagamento efetuado.",
      },
    });

    return updated;
  });
};

export const cancel = async (id: string, userId: string) => {
  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id },
  });

  if (!reimbursement) throw new AppError("Não encontrado.", 404);
  if (reimbursement.userId !== userId)
    throw new AppError("Acesso negado.", 403);

  const cancelableStatuses: Status[] = [Status.DRAFT, Status.SUBMITTED];
  if (!cancelableStatuses.includes(reimbursement.status))
    throw new AppError(
      "Apenas solicitações em RASCUNHO ou ENVIADA podem ser canceladas.",
      400,
    );

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.reimbursement.update({
      where: { id },
      data: { status: Status.CANCELED },
    });

    await tx.history.create({
      data: {
        reimbursementId: id,
        userId,
        action: Action.CANCELED,
        observation: "Cancelado pelo usuário.",
      },
    });

    return updated;
  });
};

export const getHistory = async (
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

  return await prisma.history.findMany({
    where: { reimbursementId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
};
