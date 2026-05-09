import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInput } from "./auth.schema";
import { AppError } from "../../utils/AppError";

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new AppError("Credenciais inválidas.", 401);

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) throw new AppError("Credenciais inválidas.", 401);

  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new AppError("Erro interno: JWT_SECRET não configurado.", 500);

  const token = jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
