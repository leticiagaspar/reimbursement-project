import { useRef, useContext } from "react";
import {
  Box,
  Flex,
  Grid,
  Input,
  Text,
  Button,
  NativeSelectField,
  NativeSelectRoot,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import type { DashboardFilters } from "../../hooks/useDashboard";
import { useCategories } from "../../hooks/useCategories";
import { AuthContext } from "../../contexts/AuthContext";

interface Props {
  filters: DashboardFilters;
  onFilterChange: (filters: Partial<DashboardFilters>) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "DRAFT", label: "Rascunho" },
  { value: "SUBMITTED", label: "Enviado" },
  { value: "APPROVED", label: "Aprovado" },
  { value: "REJECTED", label: "Rejeitado" },
  { value: "PAID", label: "Pago" },
  { value: "CANCELED", label: "Cancelado" },
];

const SORT_OPTIONS = [
  { value: "desc", label: "Mais recentes" },
  { value: "asc", label: "Mais antigos" },
];

export const inputStyle = {
  bg: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "white",
  borderRadius: "10px",
  fontSize: "13px",
  h: "40px",
  _placeholder: { color: "rgba(255,255,255,0.35)" },
  _hover: {
    borderColor: "rgba(255,255,255,0.2)",
    bg: "rgba(255,255,255,0.06)",
  },
  _focus: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 1px #10b981",
    bg: "rgba(16,185,129,0.05)",
  },
};

export const DashboardFiltersComponent = ({
  filters,
  onFilterChange,
}: Props) => {
  const { user } = useContext(AuthContext);
  const { categories } = useCategories();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEmployee = user?.role === "EMPLOYEE";
  const isManagerOrFinance =
    user?.role === "MANAGER" || user?.role === "FINANCE";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      onFilterChange({ search: value });
    }, 400);
  };

  const hasActiveFilters =
    filters.status !== "" || filters.categoryId !== "" || filters.search !== "";

  const clearFilters = () => {
    onFilterChange({ status: "", categoryId: "", search: "", sort: "desc" });
  };

  const gridColumns = {
    base: "1fr",
    sm: "1fr 1fr",
    lg: isEmployee
      ? "1fr 1fr 1fr"
      : isManagerOrFinance
        ? "2fr 1fr 1fr"
        : "2fr 1fr 1fr 1fr",
  };

  return (
    <Box
      as="section"
      aria-label="Filtros de solicitações"
      bg="rgba(255,255,255,0.02)"
      border="1px solid rgba(255,255,255,0.07)"
      borderRadius="16px"
      p={{ base: 4, md: 5 }}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text
          fontSize="12px"
          fontWeight="700"
          color="rgba(255,255,255,0.4)"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          Filtros
        </Text>
        {hasActiveFilters && (
          <Button
            size="xs"
            variant="ghost"
            color="#10b981"
            fontSize="12px"
            fontWeight="600"
            h="auto"
            p="2px 8px"
            _hover={{ bg: "rgba(16,185,129,0.1)" }}
            borderRadius="6px"
            onClick={clearFilters}
          >
            Limpar filtros
          </Button>
        )}
      </Flex>

      <Grid templateColumns={gridColumns} gap={3}>
        {!isEmployee && (
          <Box position="relative">
            <Box
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              color="rgba(255,255,255,0.35)"
              pointerEvents="none"
              zIndex={1}
            >
              <Search size={16} />
            </Box>
            <Input
              {...inputStyle}
              pl="36px"
              placeholder="Buscar colaborador..."
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </Box>
        )}

        {!isManagerOrFinance && (
          <Box>
            <NativeSelectRoot>
              <NativeSelectField
                {...inputStyle}
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value })}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    style={{ background: "#0d1f4e", color: "white" }}
                  >
                    {opt.label}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
        )}

        <Box>
          <NativeSelectRoot>
            <NativeSelectField
              {...inputStyle}
              value={filters.categoryId}
              onChange={(e) => onFilterChange({ categoryId: e.target.value })}
            >
              <option
                value=""
                style={{ background: "#0d1f4e", color: "white" }}
              >
                Todas as categorias
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  style={{ background: "#0d1f4e", color: "white" }}
                >
                  {cat.name}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>

        <Box>
          <NativeSelectRoot>
            <NativeSelectField
              {...inputStyle}
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({ sort: e.target.value as "asc" | "desc" })
              }
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{ background: "#0d1f4e", color: "white" }}
                >
                  {opt.label}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>
      </Grid>
    </Box>
  );
};
