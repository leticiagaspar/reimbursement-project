import { useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";

interface CreateCategoryFormProps {
  onAdd: (name: string) => Promise<void>;
  isLoading: boolean;
}

export const CreateCategoryForm = ({
  onAdd,
  isLoading,
}: CreateCategoryFormProps) => {
  const [newName, setNewName] = useState("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await onAdd(newName);
    setNewName("");
  };

  return (
    <Box
      as="section"
      bg="whiteAlpha.50"
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="xl"
      p={6}
      mb={6}
    >
      <Text
        as="h2"
        fontSize="xs"
        fontWeight="bold"
        color="whiteAlpha.600"
        textTransform="uppercase"
        mb={4}
      >
        Nova Categoria
      </Text>
      <form onSubmit={handleSubmit} aria-label="Criar nova categoria">
        <Flex gap={3} flexWrap="wrap">
          <Input
            flex={1}
            minW="200px"
            placeholder="Ex: Viagens, Refeição…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            color="white"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.300"
            _focus={{ borderColor: "green.400", boxShadow: "none" }}
          />
          <Button
            type="submit"
            loading={isLoading}
            loadingText="Criando…"
            bg="green.400"
            color="gray.900"
            _hover={{ bg: "green.300" }}
            px={6}
          >
            Adicionar
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
