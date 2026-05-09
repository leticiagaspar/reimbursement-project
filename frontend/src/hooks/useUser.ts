import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import type { User } from "../interfaces/user";
import { toaster } from "../components/ui/toaster";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toaster.create({
        title: "Erro ao carregar usuários.",
        description:
          "Não foi possível sincronizar a base de dados. Tente novamente.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, refetch: fetchUsers };
};
