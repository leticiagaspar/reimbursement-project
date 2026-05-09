import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput } from "./users.schema";
import { AppError } from "../../utils/AppError";
import { Role } from "@prisma/client";

export const create = async (data: CreateUserInput) => {
  const emailExists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (emailExists) throw new AppError("E-mail já cadastrado.", 400);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || Role.EMPLOYEE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const listAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  });
};
