import { Request, Response } from "express";
import { z } from "zod";
import * as categoriesService from "./categories.service";
import { categorySchema, updateCategorySchema } from "./categories.schema";

export const create = async (req: Request, res: Response) => {
  const data = categorySchema.parse(req.body);
  const category = await categoriesService.createCategory(data);
  res.status(201).json(category);
};

export const list = async (_req: Request, res: Response) => {
  const categories = await categoriesService.getAllCategories();
  res.json(categories);
};

export const update = async (req: Request, res: Response) => {
  const id = z.uuid("ID inválido.").parse(req.params.id);

  const data = updateCategorySchema.parse(req.body);

  const category = await categoriesService.updateCategory(id, data);
  res.json(category);
};
