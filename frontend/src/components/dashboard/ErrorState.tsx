import { Flex, Text, Button } from "@chakra-ui/react";

export const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <Flex direction="column" align="center" py={16} gap={4}>
    <Text color="white">Falha ao carregar dados</Text>
    <Text color="gray.400">{error}</Text>
    <Button onClick={onRetry}>Tentar novamente</Button>
  </Flex>
);
