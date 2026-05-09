import { Box, Container, Flex, HStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "../shared/Logo";

export const Navbar = () => {
  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="100"
      h="64px"
      bg="rgba(13, 31, 78, 0.92)"
      backdropFilter="blur(14px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.10)"
    >
      <Container maxW="1200px" h="full">
        <Flex h="full" align="center" justify="space-between">
          <Logo />

          <HStack gap="12px">
            <RouterLink to="/register" style={{ textDecoration: "none" }}>
              <Box
                px="18px"
                h="38px"
                display="flex"
                alignItems="center"
                fontSize="14px"
                fontWeight="500"
                color="white"
                borderRadius="md"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.3)"
                transition="all 0.2s"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.55)",
                }}
              >
                Registrar-se
              </Box>
            </RouterLink>

            <RouterLink to="/login" style={{ textDecoration: "none" }}>
              <Box
                px="18px"
                h="38px"
                display="flex"
                alignItems="center"
                fontSize="14px"
                fontWeight="600"
                bg="#10b981"
                color="white"
                borderRadius="md"
                transition="background 0.2s"
                _hover={{ bg: "#059669" }}
              >
                Entrar
              </Box>
            </RouterLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
