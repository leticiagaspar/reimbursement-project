import { Flex, Box, HStack, Badge, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
`;
export const FloatingPreview = () => (
  <Flex
    justify="flex-end"
    position="relative"
    display={{ base: "none", lg: "flex" }}
  >
    <Box
      animation={`${float} 7s ease-in-out infinite`}
      bg="rgba(255, 255, 255, 0.04)"
      backdropFilter="blur(14px)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      borderRadius="32px"
      p="32px"
      maxW="420px"
      w="full"
      boxShadow="0 40px 80px rgba(0,0,0,0.4)"
      aria-hidden="true"
    >
      <Flex justify="space-between" mb="20px">
        <Text
          fontSize="11px"
          color="rgba(255, 255, 255, 0.4)"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          AUDITORIA DE DESPESA
        </Text>
        <Text fontSize="11px" color="rgba(255, 255, 255, 0.3)">
          Hoje, 14:32
        </Text>
      </Flex>

      <Flex gap="16px" mb="24px">
        <Flex
          w="48px"
          h="48px"
          bg="rgba(255,255,255,0.08)"
          border="1px solid rgba(255,255,255,0.12)"
          borderRadius="14px"
          align="center"
          justify="center"
          color="white"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </Flex>
        <Box>
          <Text color="white" fontWeight="600" fontSize="16px">
            Nota Fiscal #8922
          </Text>
          <Text fontSize="13px" color="rgba(255,255,255,0.5)">
            Jantar Corporativo
          </Text>
        </Box>
      </Flex>

      <Box bg="rgba(0,0,0,0.2)" p="20px" borderRadius="16px" mb="20px">
        <Flex justify="space-between" mb="12px" align="center">
          <Text fontSize="13px" color="rgba(255,255,255,0.5)">
            Valor Solicitado
          </Text>
          <Text fontSize="24px" fontWeight="700" color="white">
            R$ 345,90
          </Text>
        </Flex>
        <HStack gap="10px">
          <Flex
            w="28px"
            h="28px"
            bg="#1a3a8f"
            borderRadius="full"
            align="center"
            justify="center"
            fontSize="10px"
            color="white"
            fontWeight="700"
          >
            JS
          </Flex>
          <Text fontSize="13px" color="rgba(255,255,255,0.7)">
            Por <strong>João Silva</strong> (Colaborador)
          </Text>
        </HStack>
      </Box>

      <Flex justify="space-between" align="center">
        <Text fontSize="13px" color="rgba(255,255,255,0.5)">
          Status Atual
        </Text>
        <Badge
          bg="rgba(16, 185, 129, 0.15)"
          color="#10b981"
          border="1px solid rgba(16, 185, 129, 0.3)"
          borderRadius="99px"
          px="12px"
          py="2px"
        >
          APROVADO
        </Badge>
      </Flex>
    </Box>
  </Flex>
);
