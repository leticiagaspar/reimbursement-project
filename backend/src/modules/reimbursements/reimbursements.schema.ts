import { z } from "zod";
import { Status } from "@prisma/client";

export const createReimbursementSchema = z.object({
  categoryId: z.uuid("Categoria inválida."),
  description: z
    .string()
    .min(5, "A descrição deve ter pelo menos 5 caracteres."),
  value: z.number().positive("O valor deve ser maior que zero."),
  expenseDate: z
    .string()
    .pipe(z.coerce.date())
    .refine((d) => d <= new Date(), {
      message: "A data da despesa não pode ser futura.",
    }),
});

export const updateReimbursementSchema = createReimbursementSchema.partial();

export const rejectReimbursementSchema = z.object({
  rejectionReason: z
    .string()
    .min(5, "A justificativa deve ter pelo menos 5 caracteres."),
});

export const listReimbursementsQuerySchema = z.object({
  status: z.enum(Status).optional(),
  categoryId: z.uuid("categoryId inválido.").optional(),
  search: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateReimbursementInput = z.infer<
  typeof createReimbursementSchema
>;
export type ListReimbursementsQuery = z.infer<
  typeof listReimbursementsQuerySchema
>;
