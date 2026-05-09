import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { AppNavbar } from "./AppNavbar";

export const AuthenticatedLayout = () => {
  return (
    <Box minH="100vh" bg="#080f1e">
      <AppNavbar />

      <Box as="main">
        <Outlet />
      </Box>
    </Box>
  );
};
