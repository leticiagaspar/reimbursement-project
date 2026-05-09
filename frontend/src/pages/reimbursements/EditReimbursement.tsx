"use client";

import { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { PageShell, SectionCard } from "../../components/Reimbursement";
import { type FormValues, ReimbursementForm } from "./ReimbursementForm";
import { StatusBadge } from "../../components/StatusBadge";
import { ReimbursementService } from "../../services/reimbursementService";
import type { Reimbursement } from "../../interfaces/reimbursement";
import { useReimbursements } from "../../hooks/useReimbursement";

const BlockedState = ({
  status,
  onBack,
}: {
  status: string;
  onBack: () => void;
}) => (
  <Box
    p={8}
    bg="rgba(251,146,60,0.07)"
    border="1px solid rgba(251,146,60,0.2)"
    borderRadius="16px"
    textAlign="center"
  >
    <Text fontWeight="700" color="white" mb={2}>
      Edição não permitida
    </Text>
    <Text fontSize="13px" color="rgba(255,255,255,0.5)" mb={5}>
      Solicitações com status{" "}
      <Box as="span" color="#fb923c" fontWeight="600">
        {status}
      </Box>{" "}
      não podem ser editadas. Apenas rascunhos podem ser modificados.
    </Text>
    <Button
      onClick={onBack}
      variant="ghost"
      bg="rgba(255,255,255,0.06)"
      color="rgba(255,255,255,0.7)"
      borderRadius="10px"
      _hover={{ bg: "rgba(255,255,255,0.1)", color: "white" }}
    >
      Ver detalhes
    </Button>
  </Box>
);

export const EditReimbursement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { updateReimbursement, actionLoading } = useReimbursements();

  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(
    null,
  );
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!id) return;
    ReimbursementService.getById(id)
      .then((data) => setReimbursement(data))
      .catch(() => navigate("/reimbursements"))
      .finally(() => setLoadingData(false));
  }, [id, navigate]);

  const handleSubmit = async (values: FormValues) => {
    if (!id) return;

    const payload = {
      description: values.description.trim(),
      value: parseFloat(values.value.replace(",", ".")),
      expenseDate: new Date(values.expenseDate).toISOString(),
      categoryId: values.categoryId,
    };

    const result = await updateReimbursement(id, payload);

    if (result) {
      navigate(`/reimbursements/${id}`, {
        state: { successMessage: "Rascunho atualizado com sucesso!" },
      });
    }
  };

  if (loadingData) {
    return (
      <PageShell>
        <Flex align="center" justify="center" py={20} gap={3} aria-busy="true">
          <Spinner color="#10b981" size="md" />
          <Text color="rgba(255,255,255,0.4)" fontSize="14px">
            Carregando…
          </Text>
        </Flex>
      </PageShell>
    );
  }

  if (!reimbursement) return null;

  const isDraft = reimbursement.status === "DRAFT";
  const expenseDateForInput = reimbursement.expenseDate.split("T")[0];

  return (
    <PageShell>
      <Box as="nav" aria-label="Navegação estrutural" mb={6}>
        <Flex
          as="button"
          onClick={() => navigate(`/reimbursements/${id}`)}
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
        >
          <ChevronLeft size={16} />
          Detalhes da Solicitação
        </Flex>
      </Box>

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
            Editar Solicitação
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "20px", md: "26px" }}
            fontWeight="700"
            color="white"
            lineHeight="1.2"
          >
            {reimbursement.description}
          </Heading>
        </Box>
        <StatusBadge status={reimbursement.status} />
      </Flex>

      {isDraft ? (
        <SectionCard
          title="Editar dados"
          description="Apenas rascunhos podem ser editados."
        >
          <ReimbursementForm
            initialValues={{
              description: reimbursement.description,
              value: reimbursement.value.toString(),
              expenseDate: expenseDateForInput,
              categoryId: reimbursement.category.id,
            }}
            onSubmit={handleSubmit}
            submitLabel="Salvar alterações"
            isLoading={actionLoading}
          />
        </SectionCard>
      ) : (
        <BlockedState
          status={reimbursement.status}
          onBack={() => navigate(`/reimbursements/${id}`)}
        />
      )}
    </PageShell>
  );
};
