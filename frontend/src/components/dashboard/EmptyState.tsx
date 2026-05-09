import { Flex, Text } from "@chakra-ui/react";

export const EmptyState = ({ role }: { role?: string }) => (
  <Flex direction="column" align="center" py={16} gap={4}>
    <Text color="white">Nenhuma solicitação encontrada</Text>
    <Text color="gray.400">
      {role === "EMPLOYEE"
        ? "Você ainda não criou nenhuma solicitação."
        : "Não há solicitações para exibir."}
    </Text>
  </Flex>
);
