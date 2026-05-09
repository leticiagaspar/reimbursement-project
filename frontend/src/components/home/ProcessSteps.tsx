import { Box, SimpleGrid, Flex, Text } from "@chakra-ui/react";

export const ProcessSteps = () => {
  const steps = [
    {
      n: 1,
      t: "Colaborador Solicita",
      d: "O funcionário cria o rascunho, anexa os comprovantes e envia para análise.",
      active: true,
    },
    {
      n: 2,
      t: "Gestor Analisa",
      d: "Aprovação ou rejeição com justificativa obrigatória registrada no histórico.",
      active: false,
    },
    {
      n: 3,
      t: "Financeiro Paga",
      d: "Auditoria final da nota fiscal e transição segura para o status de pago.",
      active: false,
    },
  ];

  return (
    <Box
      mt="80px"
      bg="rgba(255, 255, 255, 0.03)"
      backdropFilter="blur(12px)"
      border="1px solid rgba(255,255,255,0.1)"
      borderRadius="24px"
      p="28px 32px"
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="40px">
        {steps.map((step, i) => (
          <Box
            key={i}
            borderRight={{
              md: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
            pr={{ md: "20px" }}
          >
            <Flex
              w="28px"
              h="28px"
              borderRadius="8px"
              align="center"
              justify="center"
              fontWeight="800"
              fontSize="13px"
              mb="12px"
              bg={
                step.active
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(255, 255, 255, 0.1)"
              }
              color={step.active ? "#10b981" : "rgba(255, 255, 255, 0.7)"}
            >
              {step.n}
            </Flex>
            <Text color="white" fontWeight="700" fontSize="15px" mb="4px">
              {step.t}
            </Text>
            <Text
              color="rgba(255, 255, 255, 0.55)"
              fontSize="13px"
              lineHeight="1.5"
            >
              {step.d}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
