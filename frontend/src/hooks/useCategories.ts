import { useState, useEffect, useCallback } from "react";
import { toaster } from "../components/ui/toaster";
import { CategoryService } from "../services/categoryService";
import type { Category } from "../interfaces/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch {
      toaster.create({ title: "Erro ao carregar categorias.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string) => {
    if (!name.trim()) return;

    try {
      setCreating(true);
      await CategoryService.create(name.trim());
      await fetchCategories();
      toaster.create({
        title: "Categoria criada com sucesso!",
        type: "success",
      });
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao criar categoria.";
      toaster.create({ title: msg, type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      await CategoryService.update(id, data);
      await fetchCategories();
      toaster.create({ title: "Categoria atualizada.", type: "success" });
    } catch {
      toaster.create({ title: "Erro ao atualizar categoria.", type: "error" });
    }
  };

  return { categories, loading, creating, addCategory, updateCategory };
};
