import { Box, Button, Flex, Text } from "@chakra-ui/react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const btnBase = {
  minW: "36px",
  h: "36px",
  px: 2,
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
  variant: "ghost" as const,
  transition: "all 0.15s",
};

const ChevronLeft = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const getPageNumbers = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);

  return pages;
};

export const DashboardPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <Box as="nav" aria-label="Paginação de solicitações">
      <Flex justify="center" align="center" gap={2} flexWrap="wrap">
        <Button
          {...btnBase}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          color={
            currentPage <= 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)"
          }
          _hover={{ color: "white", bg: "rgba(255,255,255,0.06)" }}
          _disabled={{ cursor: "not-allowed", opacity: 0.4 }}
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </Button>

        {pages.map((page, i) =>
          page === "…" ? (
            <Text
              key={`ellipsis-${i}`}
              color="rgba(255,255,255,0.25)"
              fontSize="13px"
              px={1}
              aria-hidden="true"
            >
              …
            </Text>
          ) : (
            <Button
              key={page}
              {...btnBase}
              onClick={() => onPageChange(page)}
              bg={
                page === currentPage ? "rgba(16,185,129,0.15)" : "transparent"
              }
              color={page === currentPage ? "#10b981" : "rgba(255,255,255,0.5)"}
              borderColor={
                page === currentPage
                  ? "rgba(16,185,129,0.3)"
                  : "rgba(255,255,255,0.08)"
              }
              _hover={
                page === currentPage
                  ? {}
                  : { color: "white", bg: "rgba(255,255,255,0.06)" }
              }
              aria-label={`Ir para página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          {...btnBase}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          color={
            currentPage >= totalPages
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.6)"
          }
          _hover={{ color: "white", bg: "rgba(255,255,255,0.06)" }}
          _disabled={{ cursor: "not-allowed", opacity: 0.4 }}
          aria-label="Próxima página"
        >
          <ChevronRight />
        </Button>
      </Flex>
    </Box>
  );
};
