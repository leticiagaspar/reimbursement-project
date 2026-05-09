import { Box } from "@chakra-ui/react";
import { Status } from "../interfaces/enum";

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  [Status.DRAFT]: {
    label: "Rascunho",
    color: "rgba(255,255,255,0.6)",
    bg: "rgba(255,255,255,0.08)",
  },
  [Status.SUBMITTED]: {
    label: "Enviado",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
  [Status.APPROVED]: {
    label: "Aprovado",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
  },
  [Status.REJECTED]: {
    label: "Rejeitado",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
  },
  [Status.PAID]: {
    label: "Pago",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
  },
  [Status.CANCELED]: {
    label: "Cancelado",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
  },
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      px={3}
      py="3px"
      borderRadius="99px"
      fontSize="11px"
      fontWeight="700"
      color={s.color}
      bg={s.bg}
      border="1px solid"
      borderColor={s.color.replace("0.6", "0.2")}
    >
      {s.label}
    </Box>
  );
};
