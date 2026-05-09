import { Flex, Spinner, Text } from "@chakra-ui/react";

export const LoadingState = () => (
  <Flex direction="column" align="center" py={20} gap={4}>
    <Spinner size="xl" color="#10b981" />
    <Text color="rgba(255,255,255,0.4)">Carregando solicitações…</Text>
  </Flex>
);
