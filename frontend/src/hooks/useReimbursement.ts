"use client";

import { useState, useEffect, useCallback } from "react";
import { toaster } from "../components/ui/toaster";
import { ReimbursementService } from "../services/reimbursementService";
import type {
  Reimbursement,
  ListReimbursementsQuery,
} from "../interfaces/reimbursement";

export const useReimbursements = (initialFilters?: ListReimbursementsQuery) => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReimbursements = useCallback(
    async (filters?: ListReimbursementsQuery) => {
      try {
        setLoading(true);
        const data = await ReimbursementService.list(filters);
        setReimbursements(data);
      } catch (error) {
        toaster.create({
          title: "Erro ao carregar reembolsos.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchReimbursements(initialFilters);
  }, [fetchReimbursements, initialFilters]);

  const handleAction = async <T>(
    actionFn: () => Promise<T>,
    successMessage: string,
    errorMessage: string,
  ): Promise<T | null> => {
    try {
      setActionLoading(true);
      const data = await actionFn();

      await fetchReimbursements(initialFilters);

      toaster.create({ title: successMessage, type: "success" });
      return data;
    } catch (error: any) {
      const msg = error.response?.data?.message || errorMessage;
      toaster.create({ title: msg, type: "error" });
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const createReimbursement = (data: any) =>
    handleAction(
      () => ReimbursementService.create(data),
      "Reembolso criado com sucesso!",
      "Erro ao criar reembolso.",
    );

  const updateReimbursement = (id: string, data: any) =>
    handleAction(
      () => ReimbursementService.update(id, data),
      "Reembolso atualizado.",
      "Erro ao atualizar.",
    );

  const submitReimbursement = (id: string) =>
    handleAction(
      () => ReimbursementService.submit(id),
      "Reembolso enviado para análise!",
      "Erro ao enviar.",
    );

  const approveReimbursement = (id: string) =>
    handleAction(
      () => ReimbursementService.approve(id),
      "Reembolso aprovado!",
      "Erro ao aprovar.",
    );

  const rejectReimbursement = (id: string, reason: string) =>
    handleAction(
      () => ReimbursementService.reject(id, reason),
      "Reembolso rejeitado.",
      "Erro ao rejeitar.",
    );

  const cancelReimbursement = (id: string) =>
    handleAction(
      () => ReimbursementService.cancel(id),
      "Reembolso cancelado.",
      "Erro ao cancelar.",
    );

  const payReimbursement = (id: string) =>
    handleAction(
      () => ReimbursementService.pay(id),
      "Pagamento registrado com sucesso!",
      "Erro ao registrar pagamento.",
    );

  const uploadFile = async (id: string, file: File) => {
    try {
      setActionLoading(true);
      await ReimbursementService.uploadAttachment(id, file);
      toaster.create({
        title: "Arquivo enviado com sucesso!",
        type: "success",
      });
    } catch {
      toaster.create({ title: "Erro ao enviar arquivo.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  return {
    reimbursements,
    loading,
    actionLoading,
    refresh: fetchReimbursements,
    createReimbursement,
    updateReimbursement,
    submitReimbursement,
    approveReimbursement,
    rejectReimbursement,
    cancelReimbursement,
    payReimbursement,
    uploadFile,
  };
};
