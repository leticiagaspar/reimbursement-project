import { Box, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { Logo } from "../shared/Logo";

export const Footer = () => {
  return (
    <Box
      as="footer"
      bg="#081333"
      borderTop="1px solid rgba(255, 255, 255, 0.05)"
      py="32px"
    >
      <Container maxW="1200px">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap="24px"
        >
          <Logo />

          <Text color="rgba(255, 255, 255, 0.5)" fontSize="14px">
            &copy; {new Date().getFullYear()} ReembolsaAí. Todos os direitos
            reservados.
          </Text>

          <HStack gap="24px">
            <Text
              as="a"
              color="rgba(255, 255, 255, 0.6)"
              fontSize="14px"
              _hover={{ color: "#10b981" }}
              transition="0.2s"
            >
              Termos de Uso
            </Text>
            <Text
              as="a"
              color="rgba(255, 255, 255, 0.6)"
              fontSize="14px"
              _hover={{ color: "#10b981" }}
              transition="0.2s"
            >
              Privacidade
            </Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
