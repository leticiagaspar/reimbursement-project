import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const PageShell = ({
  children,
  maxW = "860px",
}: {
  children: ReactNode;
  maxW?: string;
}) => (
  <Box
    as="main"
    id="main-content"
    minH="100vh"
    bg="#0a1628"
    pt={{ base: "72px", md: "0" }}
  >
    <Box maxW={maxW} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
      {children}
    </Box>
  </Box>
);

export const SectionCard = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) => (
  <Box
    bg="rgba(255,255,255,0.02)"
    border="1px solid rgba(255,255,255,0.07)"
    borderRadius="16px"
    overflow="hidden"
  >
    {(title || description) && (
      <Box
        px={{ base: 4, md: 6 }}
        py={4}
        borderBottom="1px solid rgba(255,255,255,0.06)"
      >
        {title && (
          <Text
            fontSize="13px"
            fontWeight="700"
            color="white"
            mb={description ? 1 : 0}
          >
            {title}
          </Text>
        )}
        {description && (
          <Text fontSize="12px" color="rgba(255,255,255,0.4)">
            {description}
          </Text>
        )}
      </Box>
    )}
    <Box px={{ base: 4, md: 6 }} py={5}>
      {children}
    </Box>
  </Box>
);

export const FieldRow = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) => (
  <Flex
    justify="space-between"
    align="center"
    py={3}
    borderBottom="1px solid rgba(255,255,255,0.04)"
    _last={{ borderBottom: "none" }}
    gap={4}
    flexWrap="wrap"
  >
    <Text fontSize="13px" color="rgba(255,255,255,0.4)" flexShrink={0}>
      {label}
    </Text>
    <Box
      fontSize="13px"
      fontWeight={accent ? "700" : "500"}
      color={accent ? "white" : "rgba(255,255,255,0.75)"}
      textAlign="right"
    >
      {value}
    </Box>
  </Flex>
);

export const inputStyle = {
  bg: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "white",
  borderRadius: "10px",
  fontSize: "14px",
  h: "44px",
  _placeholder: { color: "rgba(255,255,255,0.3)" },
  _hover: { borderColor: "rgba(255,255,255,0.2)" },
  _focus: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 1px #10b981",
    bg: "rgba(16,185,129,0.04)",
  },
  _invalid: {
    borderColor: "#f87171",
    boxShadow: "0 0 0 1px #f87171",
  },
};

export const FormField = ({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <Box>
    <chakra.label
      as="label"
      htmlFor={htmlFor}
      display="block"
      fontSize="12px"
      fontWeight="700"
      color="rgba(255,255,255,0.5)"
      letterSpacing="0.06em"
      textTransform="uppercase"
      mb={2}
    >
      {label}
      {required && (
        <Box as="span" color="#f87171" ml={1} aria-hidden="true">
          *
        </Box>
      )}
    </chakra.label>
    {children}
    {error && (
      <Text role="alert" fontSize="12px" color="#f87171" mt={1}>
        {error}
      </Text>
    )}
  </Box>
);
