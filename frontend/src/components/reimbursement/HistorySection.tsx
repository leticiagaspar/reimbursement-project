import { useEffect, useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { ReimbursementService } from "../../services/reimbursementService";
import { formatDateTime } from "../../utils/helpers";
import type { History } from "../../interfaces/reimbursement";

export const ACTION_LABELS: Record<string, string> = {
  CREATED: "Criado",
  UPDATED: "Atualizado",
  SUBMITTED: "Enviado para análise",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  PAID: "Pago",
  CANCELED: "Cancelado",
};

interface HistorySectionProps {
  reimbursementId: string;
}

export const HistorySection = ({ reimbursementId }: HistorySectionProps) => {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReimbursementService.getHistory(reimbursementId)
      .then((data) => setHistory(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reimbursementId]);

  if (loading) {
    return (
      <Flex py={4} justify="center" aria-live="polite" aria-busy="true">
        <Spinner size="sm" color="#10b981" />
      </Flex>
    );
  }

  if (history.length === 0) {
    return (
      <Text fontSize="13px" color="rgba(255,255,255,0.3)" py={2}>
        Sem histórico.
      </Text>
    );
  }

  return (
    <Box
      as="ol"
      listStyleType="none"
      p={0}
      m={0}
      position="relative"
      aria-label="Trilha de auditoria"
    >
      <Box
        position="absolute"
        left="9px"
        top="12px"
        bottom="12px"
        w="1px"
        bg="rgba(255,255,255,0.07)"
        aria-hidden="true"
      />
      {history.map((entry: any, i) => (
        <Box
          key={entry.id}
          as="li"
          display="flex"
          gap={4}
          mb={i < history.length - 1 ? 5 : 0}
          position="relative"
        >
          <Box
            w="19px"
            h="19px"
            borderRadius="full"
            bg="#10b981"
            border="3px solid #0a1628"
            flexShrink={0}
            mt="2px"
            zIndex={1}
            aria-hidden="true"
          />
          <Box flex={1}>
            <Flex align="center" gap={2} mb="2px" flexWrap="wrap">
              <Text fontSize="13px" fontWeight="700" color="white">
                {ACTION_LABELS[entry.action] ?? entry.action}
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,0.3)">
                por {entry.user?.name}
              </Text>
            </Flex>
            <Text
              fontSize="11px"
              color="rgba(255,255,255,0.3)"
              mb={entry.observation ? 2 : 0}
            >
              <time dateTime={entry.createdAt}>
                {formatDateTime(entry.createdAt)}
              </time>
            </Text>
            {entry.observation && (
              <Text
                fontSize="12px"
                color="rgba(255,255,255,0.5)"
                bg="rgba(255,255,255,0.03)"
                border="1px solid rgba(255,255,255,0.06)"
                borderRadius="8px"
                px={3}
                py={2}
              >
                {entry.observation}
              </Text>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
