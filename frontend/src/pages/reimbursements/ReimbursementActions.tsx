import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Reimbursement } from "../../interfaces/reimbursement";
import type { Role } from "../../interfaces/enum";
import { useReimbursements } from "../../hooks/useReimbursement";
import { RejectPanel } from "../../components/reimbursement/RejectPanel";
import { ActionButton } from "../../components/reimbursement/ActionButton";

interface Props {
  reimbursement: Reimbursement;
  role: Role;
  userId: string;
  onActionSuccess: () => void;
}

export const ReimbursementActions = ({
  reimbursement,
  role,
  onActionSuccess,
}: Props) => {
  const navigate = useNavigate();
  const [showRejectPanel, setShowRejectPanel] = useState(false);

  const {
    submitReimbursement,
    approveReimbursement,
    rejectReimbursement,
    cancelReimbursement,
    payReimbursement,
    actionLoading,
  } = useReimbursements();

  const { id, status } = reimbursement;

  const handleAction = async (fn: () => Promise<any>) => {
    const result = await fn();
    if (result !== null) onActionSuccess();
  };

  return (
    <Box
      as="section"
      p={{ base: 4, md: 5 }}
      borderRadius="16px"
      bg="rgba(255,255,255,0.02)"
      border="1px solid rgba(255,255,255,0.07)"
    >
      <Text
        fontSize="11px"
        fontWeight="700"
        color="rgba(255,255,255,0.35)"
        mb={4}
        textTransform="uppercase"
      >
        Ações disponíveis
      </Text>

      <Flex gap={3} flexWrap="wrap">
        {role === "EMPLOYEE" && status === "DRAFT" && (
          <>
            <ActionButton
              label="Editar"
              variant="ghost"
              aria-label="Editar"
              onClick={() => navigate(`/reimbursements/${id}/edit`)}
            />
            <ActionButton
              label="Enviar"
              variant="primary"
              aria-label="Enviar"
              isLoading={actionLoading}
              onClick={() => handleAction(() => submitReimbursement(id))}
            />
            <ActionButton
              label="Cancelar"
              variant="warning"
              aria-label="Cancelar"
              isLoading={actionLoading}
              onClick={() => handleAction(() => cancelReimbursement(id))}
            />
          </>
        )}

        {role === "MANAGER" && status === "SUBMITTED" && (
          <>
            <ActionButton
              label="Aprovar"
              variant="primary"
              aria-label="Aprovar"
              isLoading={actionLoading}
              onClick={() => handleAction(() => approveReimbursement(id))}
            />
            <ActionButton
              label="Rejeitar"
              variant="danger"
              aria-label="Rejeitar"
              onClick={() => setShowRejectPanel(true)}
            />
          </>
        )}

        {role === "FINANCE" && status === "APPROVED" && (
          <ActionButton
            label="Marcar como pago"
            variant="primary"
            aria-label="Pagar"
            isLoading={actionLoading}
            onClick={() => handleAction(() => payReimbursement(id))}
          />
        )}
      </Flex>

      {showRejectPanel && (
        <RejectPanel
          loading={actionLoading}
          onCancel={() => setShowRejectPanel(false)}
          onConfirm={async (reason: string) => {
            const res = await rejectReimbursement(id, reason);
            if (res !== null) {
              setShowRejectPanel(false);
              onActionSuccess();
            }
          }}
        />
      )}
    </Box>
  );
};
