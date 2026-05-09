import { Box, Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const Logo = ({ variant = "light" }) => {
  const textColor = variant === "light" ? "white" : "#0d1f4e";

  return (
    <RouterLink
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
      }}
    >
      <Flex
        w="34px"
        h="34px"
        bg="#10b981"
        borderRadius="9px"
        align="center"
        justify="center"
        aria-hidden="true"
        flexShrink={0}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </Flex>

      <Flex align="baseline" gap="1px">
        <Text
          as="span"
          color={textColor}
          fontSize="1.5rem"
          letterSpacing="-0.01em"
        >
          Reembolsa
        </Text>
        <Box position="relative">
          <Text
            as="span"
            color="#10b981"
            fontSize="1.5rem"
            fontWeight="bold"
            letterSpacing="-0.01em"
          >
            Aí
          </Text>
          <Box
            position="absolute"
            bottom="4px"
            left="0"
            w="100%"
            h="2px"
            bg="#10b981"
            borderRadius="full"
            opacity="0.6"
          />
        </Box>
      </Flex>
    </RouterLink>
  );
};
