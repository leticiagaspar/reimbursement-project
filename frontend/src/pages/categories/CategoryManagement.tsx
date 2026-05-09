import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useCategories } from "../../hooks/useCategories";
import { CategoryRow } from "../../components/categories/CategoryRow";
import { CreateCategoryForm } from "../../components/categories/CreateCategoryForm";

export const CategoryManagement = () => {
  const { categories, loading, creating, addCategory, updateCategory } =
    useCategories();

  return (
    <Box as="main" minH="100vh" bg="#0a1628" py={10} px={{ base: 4, md: 8 }}>
      <Box maxW="760px" mx="auto">
        <Box as="header" mb={8}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="green.400"
            textTransform="uppercase"
            mb={1}
          >
            Administração
          </Text>
          <Text
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="white"
          >
            Gestão de Categorias
          </Text>
        </Box>

        <CreateCategoryForm onAdd={addCategory} isLoading={creating} />

        <Box
          as="section"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="xl"
          overflow="hidden"
        >
          <Flex
            as="header"
            px={5}
            py={4}
            borderBottom="1px solid"
            borderColor="whiteAlpha.100"
            justify="space-between"
            align="center"
          >
            <Text
              as="h2"
              fontSize="xs"
              fontWeight="bold"
              color="whiteAlpha.600"
              textTransform="uppercase"
            >
              Categorias cadastradas
            </Text>
            {!loading && (
              <Text fontSize="xs" color="whiteAlpha.500">
                {categories.length} {categories.length === 1 ? "item" : "itens"}
              </Text>
            )}
          </Flex>

          <Box aria-busy={loading} aria-live="polite">
            {loading ? (
              <Flex py={12} justify="center" align="center" gap={3}>
                <Spinner color="green.400" />
                <Text color="whiteAlpha.600" fontSize="sm">
                  Carregando…
                </Text>
              </Flex>
            ) : categories.length === 0 ? (
              <Flex py={12} justify="center">
                <Text color="whiteAlpha.600" fontSize="sm">
                  Nenhuma categoria cadastrada.
                </Text>
              </Flex>
            ) : (
              categories.map((cat) => (
                <CategoryRow key={cat.id} cat={cat} onUpdate={updateCategory} />
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
