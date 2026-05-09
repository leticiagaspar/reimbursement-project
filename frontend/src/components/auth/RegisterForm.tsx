import { useState } from "react";
import { Box, Input, Stack, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Field } from "../ui/field";
import {
  NativeSelectRoot,
  NativeSelectField,
} from "../../components/ui/native-select";
import type { UserRegisterData } from "../../interfaces/user";
import { Logo } from "../shared/Logo";
import { PasswordInput } from "../ui/password-input";
import { PrimaryButton } from "./PrimaryButton";
import { Role } from "../../interfaces/enum";

interface RegisterFormProps {
  onSubmit: (data: UserRegisterData) => void;
  isLoading: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const [formData, setFormData] = useState<UserRegisterData>({
    name: "",
    email: "",
    password: "",
    role: Role.EMPLOYEE,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validate = () => {
    const newErrors = {
      name: formData.name ? "" : "Nome é obrigatório",
      email: formData.email ? "" : "E-mail é obrigatório",
      password: formData.password
        ? formData.password.length < 6
          ? "Mínimo 6 caracteres"
          : ""
        : "Senha é obrigatória",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <Box w="full" maxW="400px" py={8}>
      <Box mb="28px">
        <Logo variant="dark" />
      </Box>

      <Stack gap="4px" mb="24px">
        <Heading
          as="h1"
          fontSize={{ base: "28px", md: "32px" }}
          color="#0d1f4e"
        >
          Criar Conta
        </Heading>
        <Text
          color="gray.500"
          fontSize="14px"
          fontFamily="'DM Sans', sans-serif"
        >
          Junte-se à plataforma corporativa de reembolsos.
        </Text>
      </Stack>

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="16px">
          <Field
            label="Nome Completo"
            invalid={!!errors.name}
            errorText={errors.name}
          >
            <Input
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onBlur={() => {
                if (formData.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    name: "Nome é obrigatório",
                  }));
                }
              }}
              h="44px"
              borderRadius="8px"
              _focus={{
                borderColor: "#10b981",
                boxShadow: "0 0 0 1px #10b981",
              }}
            />
          </Field>

          <Field
            label="E-mail"
            invalid={!!errors.email}
            errorText={errors.email}
          >
            <Input
              type="email"
              placeholder="exemplo@empresa.com.br"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onBlur={() => {
                if (formData.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    email: "E-mail é obrigatório",
                  }));
                }
              }}
              h="44px"
              borderRadius="8px"
              _focus={{
                borderColor: "#10b981",
                boxShadow: "0 0 0 1px #10b981",
              }}
            />
          </Field>

          <Field
            label="Senha"
            invalid={!!errors.password}
            errorText={errors.password}
          >
            <PasswordInput
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onBlur={() => {
                if (!formData.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "Senha é obrigatória",
                  }));
                } else if (formData.password.length < 6) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "Mínimo 6 caracteres",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              h="44px"
              borderRadius="8px"
              _focus={{
                borderColor: "#10b981",
                boxShadow: "0 0 0 1px #10b981",
              }}
            />
          </Field>

          <Field label="Perfil do Usuário">
            <NativeSelectRoot>
              <NativeSelectField
                h="44px"
                borderRadius="8px"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as Role,
                  })
                }
                _focus={{
                  borderColor: "#10b981",
                  boxShadow: "0 0 0 1px #10b981",
                }}
              >
                <option value={Role.EMPLOYEE}>Colaborador</option>
                <option value={Role.MANAGER}>Gestor</option>
                <option value={Role.FINANCE}>Financeiro</option>
                <option value={Role.ADMIN}>Admin</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Field>

          <PrimaryButton isLoading={isLoading}>
            Finalizar Cadastro
          </PrimaryButton>
        </Stack>
      </form>

      <Text textAlign="center" mt="24px" color="gray.500" fontSize="14px">
        Já possui conta?{" "}
        <RouterLink to="/login" style={{ textDecoration: "none" }}>
          <Text
            as="span"
            color="#10b981"
            fontWeight="600"
            _hover={{ textDecoration: "underline" }}
          >
            Fazer login
          </Text>
        </RouterLink>
      </Text>
    </Box>
  );
};
