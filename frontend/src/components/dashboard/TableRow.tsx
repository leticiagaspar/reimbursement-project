import { Box, Button, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import type { Reimbursement } from "../../hooks/useDashboard";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { StatusBadge } from "../StatusBadge";

export const TableRow = ({
  item,
  showUser,
  isLast,
}: {
  item: Reimbursement;
  showUser: boolean;
  isLast: boolean;
}) => {
  return (
    <Box
      as="tr"
      borderBottom={isLast ? "none" : "1px solid rgba(255,255,255,0.04)"}
      _hover={{ bg: "rgba(255,255,255,0.025)" }}
    >
      <Box as="td" px={5} py={4} textAlign="center">
        <Text fontSize="13px" color="rgba(255,255,255,0.55)">
          {formatDate(item.expenseDate)}
        </Text>
      </Box>

      <Box as="td" px={5} py={4} textAlign="center">
        <Text
          fontSize="13px"
          fontWeight="500"
          color="white"
          maxW="220px"
          mx="auto"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          title={item.description}
        >
          {item.description}
        </Text>
      </Box>

      <Box as="td" px={5} py={4} textAlign="center">
        <Text fontSize="13px" color="rgba(255,255,255,0.5)">
          {item.category?.name ?? "—"}
        </Text>
      </Box>

      {showUser && (
        <Box as="td" px={5} py={4} textAlign="center">
          <Text fontSize="13px" color="rgba(255,255,255,0.5)">
            {item.user?.name ?? "—"}
          </Text>
        </Box>
      )}

      <Box as="td" px={5} py={4} textAlign="center">
        <Text fontSize="13px" fontWeight="600" color="white">
          {formatCurrency(item.value)}
        </Text>
      </Box>

      <Box as="td" px={5} py={4} textAlign="center">
        <StatusBadge status={item.status} />
      </Box>

      <Box as="td" px={5} py={4} textAlign="center">
        <RouterLink to={`/reimbursements/${item.id}`}>
          <Button
            size="sm"
            h="30px"
            px={3}
            fontSize="12px"
            fontWeight="600"
            bg="rgba(255,255,255,0.03)"
            color="rgba(255,255,255,0.6)"
            borderRadius="8px"
            border="1px solid rgba(255,255,255,0.08)"
            _hover={{
              color: "white",
              bg: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.18)",
              transform: "translateY(-1px)",
            }}
            transition="all 0.15s"
          >
            Detalhes
          </Button>
        </RouterLink>
      </Box>
    </Box>
  );
};
