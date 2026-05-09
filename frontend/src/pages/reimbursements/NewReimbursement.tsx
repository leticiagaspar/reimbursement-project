"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { PageShell, SectionCard } from "../../components/Reimbursement";
import { ReimbursementForm, type FormValues } from "./ReimbursementForm";
import { useReimbursements } from "../../hooks/useReimbursement";

export const NewReimbursement = () => {
  const navigate = useNavigate();
  const { createReimbursement, actionLoading } = useReimbursements();

  const handleSubmit = async (values: FormValues) => {
    const payload = {
      description: values.description.trim(),
      value: parseFloat(values.value.replace(",", ".")),
      expenseDate: new Date(values.expenseDate).toISOString(),
      categoryId: values.categoryId,
    };

    const result = await createReimbursement(payload);

    if (result?.id) {
      navigate(`/reimbursements/${result.id}`, {
        state: { successMessage: "Solicitação criada como rascunho!" },
      });
    }
  };

  return (
    <PageShell>
      <Box as="nav" aria-label="Navegação estrutural" mb={6}>
        <Flex
          as="button"
          onClick={() => navigate(-1)}
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
          <ChevronLeft size={16} />
          Minhas Solicitações
        </Flex>
      </Box>

      <Box mb={7}>
        <Text
          fontSize="11px"
          fontWeight="700"
          letterSpacing="0.12em"
          color="#10b981"
          textTransform="uppercase"
          mb={1}
        >
          Nova Solicitação
        </Text>
        <Heading
          as="h1"
          fontSize={{ base: "22px", md: "28px" }}
          fontWeight="700"
          color="white"
          lineHeight="1.2"
        >
          Solicitar reembolso
        </Heading>
        <Text fontSize="14px" color="rgba(255,255,255,0.4)" mt={2}>
          Preencha os dados abaixo. A solicitação será salva como rascunho.
        </Text>
      </Box>

      <SectionCard
        title="Dados da despesa"
        description="Todos os campos marcados com * são obrigatórios."
      >
        <ReimbursementForm
          onSubmit={handleSubmit}
          submitLabel="Salvar rascunho"
          isLoading={actionLoading}
        />
      </SectionCard>
    </PageShell>
  );
};
