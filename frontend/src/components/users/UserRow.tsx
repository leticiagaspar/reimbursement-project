import { Box, Flex, Text } from "@chakra-ui/react";
import { RoleBadge } from "./RoleBadge";
import type { User } from "../../interfaces/user";

interface UserRowProps {
  user: User;
}

export const UserRow = ({ user }: UserRowProps) => {
  return (
    <Flex
      as="li"
      align="center"
      px={5}
      py={4}
      gap={4}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      _last={{ borderBottom: "none" }}
      _hover={{ bg: "whiteAlpha.50" }}
      transition="background 0.2s ease-in-out"
    >
      <Box flex={1}>
        <Text fontSize="sm" fontWeight="600" color="white">
          {user.name}
        </Text>
        <Text fontSize="xs" color="whiteAlpha.600">
          {user.email}
        </Text>
      </Box>

      <Box w="100px">
        <RoleBadge role={user.role} />
      </Box>
    </Flex>
  );
};
