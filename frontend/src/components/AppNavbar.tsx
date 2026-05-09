import { Box, Container, Flex, HStack } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Logo } from "./shared/Logo";
import { Role } from "../interfaces/enum";

export const AppNavbar = () => {
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === Role.ADMIN;

  const NavItem = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname.startsWith(to);

    return (
      <RouterLink to={to} style={{ textDecoration: "none" }}>
        <Box
          px="18px"
          h="38px"
          display="flex"
          alignItems="center"
          fontSize="14px"
          fontWeight={isActive ? "600" : "500"}
          color="white"
          borderRadius="md"
          border="1px solid"
          borderColor={
            isActive ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.3)"
          }
          bg={isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"}
          transition="all 0.2s"
          _hover={{
            bg: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.6)",
          }}
        >
          {label}
        </Box>
      </RouterLink>
    );
  };

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
            <NavItem to="/reimbursements" label="Reembolsos" />

            {isAdmin && (
              <>
                <NavItem to="/categories" label="Categorias" />
                <NavItem to="/users" label="Usuários" />
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
