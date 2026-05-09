import { useContext } from "react";
import { Container, Box } from "@chakra-ui/react";
import { DashboardFiltersComponent } from "../../components/dashboard/DashboardFilters";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardPagination } from "../../components/dashboard/DashboardPagination";
import { ReimbursementsTable } from "../../components/dashboard/ReimbursementTable";
import { AuthContext } from "../../contexts/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";

export const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const {
    reimbursements,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    setPage,
    refetch,
  } = useDashboard();

  const headingByRole: Record<string, string> = {
    EMPLOYEE: "Minhas Solicitações",
    MANAGER: "Solicitações Enviadas",
    FINANCE: "Solicitações Aprovadas",
    ADMIN: "Todas as Solicitações",
  };

  const title = headingByRole[user?.role] ?? "Solicitações";

  return (
    <Box
      as="main"
      id="main-content"
      minH="100vh"
      bg="#0a1628"
      pt={{ base: "72px", md: "0" }}
    >
      <Container
        maxW="container.xl"
        py={{ base: 6, md: 10 }}
        px={{ base: 4, md: 8 }}
      >
        <DashboardHeader title={title} role={user?.role} onRefresh={refetch} />

        <Box mt={6}>
          <DashboardFiltersComponent
            filters={filters}
            onFilterChange={setFilters}
          />
        </Box>

        <Box mt={6}>
          <ReimbursementsTable
            data={reimbursements}
            loading={loading}
            error={error}
            role={user?.role}
            onRetry={refetch}
          />
        </Box>

        {!loading && !error && pagination.totalPages > 1 && (
          <Box mt={6}>
            <DashboardPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};
