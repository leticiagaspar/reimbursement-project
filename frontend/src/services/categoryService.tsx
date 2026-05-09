import type { Category } from "../interfaces/category";
import api from "./api";

export const CategoryService = {
  getAll: async () => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },

  create: async (name: string) => {
    const response = await api.post<Category>("/categories", {
      name,
      active: true,
    });
    return response.data;
  },

  update: async (id: string, data: Partial<Category>) => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },
};
