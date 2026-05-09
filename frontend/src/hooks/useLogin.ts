import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { toaster } from "../components/ui/toaster";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    if (!data.email || !data.password) {
      toaster.create({
        title: "Campos vazios",
        description: "Por favor, preencha e-mail e senha para entrar.",
        type: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn(data);

      toaster.create({
        title: "Bem-vindo!",
        description: "Login efetuado com sucesso.",
        type: "success",
      });

      navigate("/reimbursements");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "E-mail ou senha incorretos.";

      toaster.create({
        title: "Falha no acesso",
        description: message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};
