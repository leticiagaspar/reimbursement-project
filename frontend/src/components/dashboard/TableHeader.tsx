import { Box } from "@chakra-ui/react";

const thStyle = {
  px: 5,
  py: 3,
  fontSize: "11px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.35)",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

export const TableHeader = ({ showUser }: { showUser: boolean }) => (
  <Box as="thead">
    <Box as="tr" borderBottom="1px solid rgba(255,255,255,0.06)">
      <Box as="th" {...thStyle}>
        Data
      </Box>
      <Box as="th" {...thStyle}>
        Descrição
      </Box>
      <Box as="th" {...thStyle}>
        Categoria
      </Box>

      {showUser && (
        <Box as="th" {...thStyle}>
          Colaborador
        </Box>
      )}

      <Box as="th" {...thStyle}>
        Valor
      </Box>
      <Box as="th" {...thStyle}>
        Status
      </Box>
      <Box as="th" {...thStyle}>
        Ações
      </Box>
    </Box>
  </Box>
);
