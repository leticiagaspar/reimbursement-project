import { prisma } from "../../config/prisma";
import { CategoryInput } from "./categories.schema";
import { AppError } from "../../utils/AppError";

export const createCategory = async (data: CategoryInput) => {
  const normalizedName = data.name.trim().toLowerCase();

  const categoryExists = await prisma.category.findUnique({
    where: { name: normalizedName },
  });

  if (categoryExists) {
    throw new AppError("Já existe uma categoria com este nome.", 400);
  }

  return prisma.category.create({
    data: { ...data, name: normalizedName },
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

export const updateCategory = async (
  id: string,
  data: Partial<CategoryInput>,
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError("Categoria não encontrada.", 404);
  }

  if (data.name) {
    const normalizedName = data.name.trim().toLowerCase();

    const nameExists = await prisma.category.findUnique({
      where: { name: normalizedName },
    });

    if (nameExists && nameExists.id !== id) {
      throw new AppError("Já existe uma categoria com este nome.", 400);
    }

    data.name = normalizedName;
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.active !== undefined && { active: data.active }),
    },
  });
};