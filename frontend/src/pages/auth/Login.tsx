import { Flex, Grid } from "@chakra-ui/react";
import AuthVisualSide from "../../components/auth/AuthVisualSide";
import { LoginForm } from "../../components/auth/LoginForm";
import { useLogin } from "../../hooks/useLogin";

export const Login = () => {
  const { handleLogin, isLoading } = useLogin();

  return (
    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} minH="100vh">
      <Flex
        as="main"
        align="center"
        justify="center"
        bg="white"
        px={{ base: "24px", md: "64px" }}
        py="40px"
      >
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </Flex>

      <AuthVisualSide />
    </Grid>
  );
};
