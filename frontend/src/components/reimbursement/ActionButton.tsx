import { Button } from "@chakra-ui/react";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  variant: "primary" | "danger" | "ghost" | "warning";
  "aria-label": string;
}

const styles = {
  primary: { bg: "#10b981", color: "white", _hover: { bg: "#059669" } },
  danger: {
    bg: "rgba(248,113,113,0.12)",
    color: "#f87171",
    border: "1px solid rgba(248,113,113,0.3)",
    _hover: { bg: "rgba(248,113,113,0.2)" },
  },
  warning: {
    bg: "rgba(251,146,60,0.12)",
    color: "#fb923c",
    border: "1px solid rgba(251,146,60,0.3)",
    _hover: { bg: "rgba(251,146,60,0.2)" },
  },
  ghost: {
    bg: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.1)",
    _hover: { bg: "rgba(255,255,255,0.09)", color: "white" },
  },
};

export const ActionButton = ({
  label,
  onClick,
  isLoading,
  variant,
  "aria-label": ariaLabel,
}: ActionButtonProps) => (
  <Button
    onClick={onClick}
    loading={isLoading}
    borderRadius="10px"
    h="40px"
    px={5}
    fontSize="13px"
    fontWeight="600"
    transition="all 0.15s"
    aria-label={ariaLabel}
    {...styles[variant]}
  >
    {label}
  </Button>
);
