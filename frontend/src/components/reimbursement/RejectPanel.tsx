import { useState } from "react";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";

interface RejectPanelProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export const RejectPanel = ({
  onConfirm,
  onCancel,
  loading,
}: RejectPanelProps) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!reason.trim() || reason.trim().length < 10) {
      setError("Informe uma justificativa de ao menos 10 caracteres.");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <Box
      mt={4}
      p={4}
      borderRadius="12px"
      role="region"
      aria-label="Painel de rejeição"
      bg="rgba(248,113,113,0.06)"
      border="1px solid rgba(248,113,113,0.2)"
    >
      <Text fontSize="13px" fontWeight="700" color="#f87171" mb={3}>
        Justificativa de rejeição *
      </Text>
      <Textarea
        placeholder="Descreva o motivo da rejeição…"
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          setError("");
        }}
        bg="rgba(255,255,255,0.04)"
        border="1px solid rgba(248,113,113,0.3)"
        color="white"
        fontSize="13px"
        minH="80px"
        aria-invalid={!!error}
      />
      {error && (
        <Text color="#f87171" fontSize="12px" mt={1}>
          {error}
        </Text>
      )}
      <Flex gap={3} mt={3} justify="flex-end">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          size="sm"
          bg="#f87171"
          color="white"
          loading={loading}
          onClick={handleSubmit}
        >
          Confirmar rejeição
        </Button>
      </Flex>
    </Box>
  );
};
