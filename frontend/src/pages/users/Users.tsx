import { Box, Flex, Spinner, Text, Heading } from "@chakra-ui/react";
import { useUsers } from "../../hooks/useUser";
import { UserRow } from "../../components/users/UserRow";

export const Users = () => {
  const { users, isLoading } = useUsers();

  return (
    <Box as="main" minH="100vh" bg="#0a1628" py={10} px={{ base: 4, md: 8 }}>
      <Box maxW="900px" mx="auto">
        <Box as="header" mb={8}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="widest"
            color="green.400"
            textTransform="uppercase"
            mb={1}
          >
            Segurança & Acesso
          </Text>
          <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }} color="white">
            Usuários
          </Heading>
        </Box>

        <Box
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="2xl"
          overflow="hidden"
          backdropFilter="blur(10px)"
        >
          <Flex
            px={6}
            py={4}
            borderBottom="1px solid"
            borderColor="whiteAlpha.200"
            align="center"
            justify="space-between"
            bg="whiteAlpha.50"
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="whiteAlpha.600"
              letterSpacing="wider"
              textTransform="uppercase"
            >
              Colaboradores Ativos
            </Text>
            {!isLoading && (
              <Text fontSize="xs" color="whiteAlpha.500" fontWeight="bold">
                {users.length} TOTAL
              </Text>
            )}
          </Flex>

          {isLoading ? (
            <Flex
              py={20}
              direction="column"
              justify="center"
              align="center"
              gap={4}
            >
              <Spinner color="emerald.400" size="xl" />
              <Text fontSize="sm" color="whiteAlpha.500">
                Sincronizando base de usuários...
              </Text>
            </Flex>
          ) : users.length === 0 ? (
            <Flex py={20} justify="center">
              <Text fontSize="sm" color="whiteAlpha.500">
                Nenhum usuário encontrado.
              </Text>
            </Flex>
          ) : (
            <Box as="ul" listStyleType="none">
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
