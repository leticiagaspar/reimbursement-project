import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import type { UserRegisterData } from "../interfaces/user";
import { toaster } from "../components/ui/toaster";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: UserRegisterData) => {
    if (!data.name || !data.email || !data.password) {
      toaster.create({
        title: "Campos vazios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        type: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      await userService.register(data);

      toaster.create({
        title: "Conta criada!",
        description: "Cadastro realizado com sucesso. Faça seu login.",
        type: "success",
      });

      navigate("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Não foi possível realizar o cadastro.";

      toaster.create({
        title: "Falha no cadastro",
        description: message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
};
