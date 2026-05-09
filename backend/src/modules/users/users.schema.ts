import { z } from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    role: z.enum(Role).default(Role.EMPLOYEE),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
