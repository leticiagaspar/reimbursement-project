import { useState } from "react";
import { Box, Input, Stack, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Field } from "../../components/ui/field";
import { Logo } from "../shared/Logo";
import { PasswordInput } from "../ui/password-input";
import { PrimaryButton } from "./PrimaryButton";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    const newErrors = {
      email: email ? "" : "E-mail é obrigatório",
      password: password ? "" : "Senha é obrigatória",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({ email, password });
  };

  return (
    <Box w="full" maxW="400px">
      <Box mb="48px">
        <Logo variant="dark" />
      </Box>

      <Stack gap="8px" mb="32px">
        <Heading
          as="h1"
          fontSize={{ base: "28px", md: "32px" }}
          color="#0d1f4e"
        >
          Bem-vindo de volta
        </Heading>
        <Text color="gray.500">Acesse sua conta corporativa.</Text>
      </Stack>

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="20px">
          <Field
            label="E-mail"
            invalid={!!errors.email}
            errorText={errors.email}
          >
            <Input
              type="email"
              placeholder="exemplo@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                if (email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    email: "E-mail é obrigatório",
                  }));
                }
              }}
              h="48px"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                if (password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    password: "Senha é obrigatória",
                  }));
                }
              }}
              h="48px"
              borderRadius="8px"
              _focus={{
                borderColor: "#10b981",
                boxShadow: "0 0 0 1px #10b981",
              }}
            />
          </Field>

          <PrimaryButton isLoading={isLoading}>
            Entrar na plataforma
          </PrimaryButton>
        </Stack>
      </form>

      <Text textAlign="center" mt="32px" color="gray.500">
        Ainda não tem uma conta?{" "}
        <RouterLink to="/register">
          <Text as="span" color="#10b981" fontWeight="600">
            Cadastre-se aqui
          </Text>
        </RouterLink>
      </Text>
    </Box>
  );
};
