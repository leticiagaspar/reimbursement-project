import { Button, type ButtonProps } from "@chakra-ui/react";

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const PrimaryButton = ({
  children,
  isLoading,
  ...props
}: PrimaryButtonProps) => {
  return (
    <Button
      type="submit"
      bg="#10b981"
      color="white"
      h="48px"
      fontSize="15px"
      fontWeight="600"
      borderRadius="8px"
      loading={isLoading}
      _hover={{
        bg: "#059669",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      transition="all 0.2s"
      width="full"
      {...props}
    >
      {children}
    </Button>
  );
};
