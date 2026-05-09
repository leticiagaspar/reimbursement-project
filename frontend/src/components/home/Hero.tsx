import {
  Box,
  Container,
  Grid,
  Text,
  Heading,
  Button,
  HStack,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { FloatingPreview } from "./FloatingPreview";
import { ProcessSteps } from "./ProcessSteps";

export const Hero = () => {
  return (
    <Box
      as="section"
      position="relative"
      bg="#0d1f4e"
      overflow="hidden"
      bgImage="radial-gradient(at 65% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 70%)"
      pt="60px"
      pb="80px"
    >
      <Box
        position="absolute"
        inset="0"
        pointerEvents="none"
        opacity="0.05"
        bgImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
      />

      <Container maxW="1200px" position="relative" zIndex="1">
        <Grid
          templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
          gap="64px"
          alignItems="center"
        >
          <Stack gap="24px">
            <Badge
              bg="rgba(255, 255, 255, 0.07)"
              color="white"
              border="1px solid rgba(255, 255, 255, 0.1)"
              px="14px"
              py="6px"
              borderRadius="99px"
              w="fit-content"
              fontSize="11px"
              letterSpacing="0.05em"
              fontWeight="600"
            >
              GESTÃO COM APURAÇÃO EM NÍVEIS
            </Badge>

            <Heading
              as="h1"
              color="white"
              fontSize={{ base: "42px", md: "64px" }}
              lineHeight="1.08"
              fontWeight="400"
            >
              O fluxo das suas despesas,{" "}
              <Text as="span" fontStyle="italic" color="#10b981">
                auditado e seguro.
              </Text>
            </Heading>

            <Text
              color="rgba(255, 255, 255, 0.6)"
              fontSize="18px"
              maxW="520px"
              lineHeight="1.6"
              fontFamily="'DM Sans', sans-serif"
            >
              Gestão de reembolsos com aprovação multinível e histórico
              imutável, garantindo auditoria completa em tempo real.
            </Text>

            <HStack gap="16px" pt="8px">
              <Button
                bg="#10b981"
                color="white"
                h="56px"
                px="32px"
                fontSize="16px"
                borderRadius="12px"
                _hover={{ bg: "#059669", transform: "translateY(-2px)" }}
                transition="0.2s"
              >
                Acessar Sistema
              </Button>
              <Button
                variant="outline"
                color="white"
                borderColor="rgba(255,255,255,0.3)"
                h="56px"
                px="28px"
                fontSize="16px"
                borderRadius="12px"
                _hover={{ bg: "rgba(255,255,255,0.08)" }}
              >
                Ver como funciona
              </Button>
            </HStack>
          </Stack>

          <FloatingPreview />
        </Grid>

        <ProcessSteps />
      </Container>
    </Box>
  );
};
