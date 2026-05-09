import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import type { Status } from "../interfaces/enum";

export interface Reimbursement {
  id: string;
  description: string;
  value: number;
  status: Status;
  expenseDate: string;
  category: { name: string };
  user?: { id: string; name: string; email: string };
}

export interface DashboardFilters {
  status: string;
  categoryId: string;
  search: string;
  sort: "asc" | "desc";
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

const DEFAULT_FILTERS: DashboardFilters = {
  status: "",
  categoryId: "",
  search: "",
  sort: "desc",
};

const LIMIT = 10;

export const useDashboard = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] =
    useState<DashboardFilters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchReimbursements = useCallback(
    async (currentFilters: DashboardFilters, page: number) => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, string | number> = {
          page,
          limit: LIMIT,
          sort: currentFilters.sort,
        };

        if (currentFilters.status) params.status = currentFilters.status;
        if (currentFilters.categoryId)
          params.categoryId = currentFilters.categoryId;
        if (currentFilters.search) params.search = currentFilters.search;

        const response = await api.get("/reimbursements", { params });

        if (response.data && response.data.data) {
          setReimbursements(response.data.data);
          setPagination({
            page: response.data.page || page,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || 0,
          });
        } else if (Array.isArray(response.data)) {
          setReimbursements(response.data);
          setPagination({ page, totalPages: 1, total: response.data.length });
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          "Erro ao carregar solicitações. Tente novamente.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchReimbursements(filters, pagination.page);
  }, [filters, pagination.page, fetchReimbursements]);

  const setFilters = (newFilters: Partial<DashboardFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const refetch = () => {
    fetchReimbursements(filters, pagination.page);
  };

  return {
    reimbursements,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    setPage,
    refetch,
  };
};
