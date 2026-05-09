import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Grid, Heading, Spinner, Text } from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";

import { AuthContext } from "../../contexts/AuthContext";
import { ReimbursementService } from "../../services/reimbursementService";
import type { Reimbursement } from "../../interfaces/reimbursement";

import {
  PageShell,
  SectionCard,
  FieldRow,
} from "../../components/Reimbursement";
import { ReimbursementActions } from "./ReimbursementActions";
import { StatusBadge } from "../../components/StatusBadge";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "../../utils/helpers";
import { AttachmentsSection } from "../../components/reimbursement/AttachmentsSection";
import { HistorySection } from "../../components/reimbursement/HistorySection";
import { Status } from "../../interfaces/enum";
import { AttachmentUploader } from "../../components/reimbursement/AttachmentUploader";

export const ReimbursementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [successMsg] = useState<string>(location.state?.successMessage ?? "");

  const fetchDetail = useCallback(() => {
    if (!id) return;
    setLoading(true);

    ReimbursementService.getById(id)
      .then((data) => setReimbursement(data))
      .catch(() => navigate("/reimbursements"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading || !reimbursement) {
    return (
      <PageShell maxW="900px">
        <Flex
          align="center"
          justify="center"
          py={20}
          gap={3}
          aria-live="polite"
          aria-busy="true"
        >
          <Spinner color="#10b981" size="lg" />
          <Text color="rgba(255,255,255,0.4)">Carregando…</Text>
        </Flex>
      </PageShell>
    );
  }

  return (
    <PageShell maxW="900px">
      <Box as="nav" aria-label="Navegação estrutural" mb={6}>
        <Flex
          as="button"
          onClick={() => navigate("/reimbursements")}
          align="center"
          gap={2}
          color="rgba(255,255,255,0.4)"
          fontSize="13px"
          _hover={{ color: "rgba(255,255,255,0.7)" }}
          transition="color 0.15s"
          bg="transparent"
          border="none"
          cursor="pointer"
          p={0}
          aria-label="Voltar para lista de solicitações"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Solicitações
        </Flex>
      </Box>

      {successMsg && (
        <Box
          role="status"
          aria-live="polite"
          mb={5}
          p={4}
          bg="rgba(16,185,129,0.08)"
          border="1px solid rgba(16,185,129,0.25)"
          borderRadius="12px"
        >
          <Text fontSize="13px" color="#10b981" fontWeight="600">
            ✓ {successMsg}
          </Text>
        </Box>
      )}

      <Flex
        justify="space-between"
        align="flex-start"
        gap={4}
        mb={7}
        flexWrap="wrap"
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
            Solicitação de Reembolso
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "20px", md: "26px" }}
            fontWeight="700"
            color="white"
            lineHeight="1.3"
            maxW="500px"
          >
            {reimbursement.description}
          </Heading>
        </Box>
        <StatusBadge status={reimbursement.status} />
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <SectionCard title="Dados da solicitação">
          <FieldRow
            label="Colaborador"
            value={(reimbursement as any).user?.name}
          />
          <FieldRow
            label="Categoria"
            value={(reimbursement as any).category?.name}
          />
          <FieldRow
            label="Data da despesa"
            value={formatDate(reimbursement.expenseDate)}
          />
          <FieldRow
            label="Valor"
            value={formatCurrency(reimbursement.value)}
            accent
          />
          <FieldRow
            label="Criado em"
            value={formatDateTime(reimbursement.createdAt)}
          />
          <FieldRow
            label="Atualizado em"
            value={formatDateTime(reimbursement.updatedAt)}
          />
        </SectionCard>

        {reimbursement.status === "REJECTED" &&
          reimbursement.rejectionReason && (
            <Box
              p={5}
              bg="rgba(248,113,113,0.07)"
              border="1px solid rgba(248,113,113,0.2)"
              borderRadius="16px"
            >
              <Text
                fontSize="12px"
                fontWeight="700"
                color="#f87171"
                letterSpacing="0.06em"
                textTransform="uppercase"
                mb={2}
              >
                Motivo da rejeição
              </Text>
              <Text
                fontSize="14px"
                color="rgba(255,255,255,0.7)"
                lineHeight="1.6"
              >
                {reimbursement.rejectionReason}
              </Text>
            </Box>
          )}

        <SectionCard title="Anexos">
          {user?.id === reimbursement.user.id &&
            [Status.DRAFT, Status.SUBMITTED].includes(reimbursement.status) && (
              <AttachmentUploader reimbursementId={reimbursement.id} />
            )}

          <AttachmentsSection reimbursementId={reimbursement.id} />
        </SectionCard>
      </Grid>

      {user && (
        <Box mt={5}>
          <ReimbursementActions
            reimbursement={reimbursement}
            role={user.role}
            userId={user.id}
            onActionSuccess={fetchDetail}
          />
        </Box>
      )}

      <Box mt={5}>
        <SectionCard
          title="Histórico de auditoria"
          description="Trilha completa de todas as ações realizadas."
        >
          <HistorySection reimbursementId={reimbursement.id} />
        </SectionCard>
      </Box>
    </PageShell>
  );
};
