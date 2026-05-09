import { Flex, Grid } from "@chakra-ui/react";
import { useRegister } from "../../hooks/useRegister";
import AuthVisualSide from "../../components/auth/AuthVisualSide";
import { RegisterForm } from "../../components/auth/RegisterForm";

export const Register = () => {
  const { handleRegister, isLoading } = useRegister();

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      minH="100vh"
      overflow="hidden"
    >
      <Flex
        as="main"
        align="center"
        justify="center"
        bg="white"
        px={{ base: "24px", md: "64px" }}
        h="100%"
      >
        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
      </Flex>

      <AuthVisualSide />
    </Grid>
  );
};
