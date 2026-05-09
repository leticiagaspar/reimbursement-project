import { Badge } from "@chakra-ui/react";
import type { Role } from "../../interfaces/enum";

interface RoleBadgeProps {
  role: Role;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const configs: Record<Role, { colorScheme: string; label: string }> = {
    ADMIN: { colorScheme: "yellow", label: "Admin" },
    MANAGER: { colorScheme: "purple", label: "Gerente" },
    FINANCE: { colorScheme: "cyan", label: "Financeiro" },
    EMPLOYEE: { colorScheme: "gray", label: "Colaborador" },
  };

  const config = configs[role] || configs.EMPLOYEE;

  return (
    <Badge
      colorScheme={config.colorScheme}
      px={2}
      py={0.5}
      borderRadius="md"
      fontSize="0.65rem"
      letterSpacing="wider"
    >
      {config.label}
    </Badge>
  );
};
