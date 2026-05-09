import { Box, Button, Flex, Heading, Text, IconButton } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefreshCw, Plus } from "lucide-react";

interface Props {
  title: string;
  role?: string;
  onRefresh: () => void;
}

export const DashboardHeader = ({ title, role, onRefresh }: Props) => {
  const canCreate = role === "EMPLOYEE";

  return (
    <Box as="header" borderBottom="1px solid rgba(255,255,255,0.07)" pb={6}>
      <Flex
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        gap={4}
        flexDir={{ base: "column", sm: "row" }}
      >
        <Box>
          <Text
            fontSize="11px"
            fontWeight="700"
            letterSpacing="0.12em"
            color="#10b981"
            textTransform="uppercase"
            mb={1}
          >
            Painel de Controle
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "22px", md: "28px" }}
            fontWeight="700"
            color="white"
            lineHeight="1.2"
          >
            {title}
          </Heading>
        </Box>

        <Flex gap={3} align="center" flexShrink={0}>
          <IconButton
            aria-label="Atualizar lista"
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            color="rgba(255,255,255,0.5)"
            _hover={{ color: "white", bg: "rgba(255,255,255,0.06)" }}
            borderRadius="10px"
          >
            <RefreshCw size={18} />
          </IconButton>

          {canCreate && (
            <RouterLink
              to="/reimbursements/new"
              style={{ textDecoration: "none" }}
            >
              <Button
                bg="#10b981"
                color="white"
                h="40px"
                px={5}
                fontSize="14px"
                fontWeight="600"
                borderRadius="10px"
                gap={2}
                _hover={{ bg: "#059669", transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                <Plus size={18} />
                Nova Solicitação
              </Button>
            </RouterLink>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
